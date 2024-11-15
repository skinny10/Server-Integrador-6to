import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const amqp = require("amqplib");
import { TemperatureService } from './domain/services/TemperatureService';
import { TemperatureService2 } from './domain/services/TemperatureService2';
import { HumidityService2 } from './domain/services/HumidityService2';
import { HumidityService } from './domain/services/HumidityService';
import { SensorDataController } from './application/controllers/SensorDataController';
import WebSocketServer from './infrastructure/websocket/webSocketServer';

const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sensordata')
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

const temperatureService = new TemperatureService();
const temperatureService2 = new TemperatureService2();
const humidityService = new HumidityService();
const humidityService2 = new HumidityService2();

const sensorDataController = new SensorDataController(
  temperatureService,
  temperatureService2,
  humidityService,
  humidityService2
);

app.post('/temperature', (req, res) => sensorDataController.handleTemperatureData(req, res));
app.post('/temperature2', (req, res) => sensorDataController.handleTemperatureData(req, res));
app.post('/humidity', (req, res) => sensorDataController.handleHumidityData(req, res));
app.post('/humidity2', (req, res) => sensorDataController.handleHumidityData(req, res));
const websocketServer = new WebSocketServer(server);

// Configuración de RabbitMQ
const rabbitSettings = {
  protocol: "amqp",
  hostname: "23.21.77.212",
  port: 5672,
  username: "angel",
  password: "angel123",
  vhost: "/",  
};

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitSettings);
    const channel = await connection.createChannel();

    const queue = 'mqtt';
    await channel.assertQueue(queue, { durable: true });
    console.log(`Esperando mensajes en la cola: ${queue}`);

    channel.consume(queue, async (msg: any) => {
      if (msg !== null) {
          const messageContent = msg.content.toString();
          let sensorData;
  
          try {
              // Intentar corregir comillas simples y analizar el mensaje como JSON
              const formattedMessage = messageContent.replace(/'/g, '"');
              sensorData = JSON.parse(formattedMessage);
              console.log('Datos recibidos desde RabbitMQ:', sensorData);
  
              // Procesar los datos del sensor
              if (sensorData.temperatura !== undefined) {
                  await temperatureService.saveTemperatureData(sensorData.temperatura);
              } 
              if (sensorData.humedad !== undefined) {
                  await humidityService.saveHumidityData(sensorData.humedad);
              }
  
              // Enviar los datos a través de WebSocket
              websocketServer.broadcast(sensorData);
          } catch (error) {
              console.error('Error al procesar el mensaje:', messageContent, error);
          } finally {
              // Confirmar el mensaje, sea válido o no
              channel.ack(msg);
          }
      }
  });
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}

connectToRabbitMQ();