import express from 'express';
import bodyParser from 'body-parser';
const amqp = require("amqplib");
import { InMemorySensorDataRepository } from './infrastructure/repositories/InMemorySensorDataRepository';
import { TemperatureService } from './domain/services/TemperatureService';
import { HumidityService } from './domain/services/HumidityService';
import { SensorDataController } from './application/controllers/SensorDataController';
import WebSocketServer from './infrastructure/websocket/webSocketServer';

const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(bodyParser.json());

const sensorDataRepository = new InMemorySensorDataRepository();
const temperatureService = new TemperatureService(sensorDataRepository);
const humidityService = new HumidityService(sensorDataRepository);
const sensorDataController = new SensorDataController(
  temperatureService,
  humidityService,
);

app.post('/temperature', (req, res) => sensorDataController.handleTemperatureData(req, res));
app.post('/humidity', (req, res) => sensorDataController.handleHumidityData(req, res));

const websocketServer = new WebSocketServer(server);

// Configuración de RabbitMQ
const rabbitSettings = {
  protocol: "amqp",
  hostname: "35.153.235.110",
  port: 5672,
  username: "ferluna",
  password: "integrador6",
  vhost: "/",  
};

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitSettings);
    const channel = await connection.createChannel();


    const queue = 'integrador';
    await channel.assertQueue(queue, { durable: true });
    console.log(`Esperando mensajes en la cola: ${queue}`);

    channel.consume(queue, (msg: any) => {
        if (msg !== null) {
          const sensorData = JSON.parse(msg.content.toString());
          console.log('Datos recibidos desde RabbitMQ:', sensorData);
      
          websocketServer.broadcast(sensorData);
          channel.ack(msg);
        }
      });
  } catch (error) {
    console.error('Error al conectar a RabbitMQ:', error);
  }
}


connectToRabbitMQ();

