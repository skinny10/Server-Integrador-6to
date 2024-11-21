import express from 'express';
import bodyParser from 'body-parser';
import amqp from 'amqplib';
import sequelize from './config/database';
import { TemperatureService } from './domain/services/TemperatureService';
import { TemperatureService2 } from './domain/services/TemperatureService2';
import { HumidityService2 } from './domain/services/HumidityService2';
import { HumidityService } from './domain/services/HumidityService';
import { SensorDataController } from './application/controllers/SensorDataController';
import WebSocketServer from './infrastructure/websocket/webSocketServer';

const app = express();
const port = 3000;
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

app.use(bodyParser.json());
  
// Configuración de Sequelize
sequelize
  .sync()
  .then(() => {
    console.log('Conectado a MySQL y modelos sincronizados.');
  })
  .catch((error) => {
    console.error('Error al conectar a MySQL:', error);
  });

// Instancia de servicios y controlador
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

// Rutas de API
app.post('/temperature', (req, res) =>
  sensorDataController.handleTemperatureData(req, res)
);
app.post('/temperature2', (req, res) =>
  sensorDataController.handleTemperatureData(req, res)
);
app.post('/humidity', (req, res) =>
  sensorDataController.handleHumidityData(req, res)
);
app.post('/humidity2', (req, res) =>
  sensorDataController.handleHumidityData(req, res)
);

// Configuración de WebSocket
const websocketServer = new WebSocketServer(server);

// Configuración de RabbitMQ
const rabbitSettings = {
  protocol: 'amqp',
  hostname: '35.153.235.110',
  port: 5672,
  username: 'angel',
  password: 'angel123',
  vhost: '/',
};

async function connectToRabbitMQ() {
  try {
    console.log("Intentando conectar a RabbitMQ...");
    const connection = await amqp.connect(rabbitSettings);
    console.log("Conexión exitosa a RabbitMQ.");

    const channel = await connection.createChannel();
    const queues = ["mqtt", "mqtt2"];

    for (const queue of queues) {
      await channel.assertQueue(queue, { durable: true });
      console.log(`Esperando mensajes en la cola: ${queue}`);

      channel.consume(queue, async (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          console.log(`Mensaje recibido desde RabbitMQ en ${queue}:`, messageContent);

          try {
            let sensorData;

            // Verificar si el mensaje es un JSON válido
            if (messageContent.trim().startsWith("{")) {
              // Intentar parsear como JSON
              sensorData = JSON.parse(messageContent);
            } else {
              // Analizar el texto plano
              sensorData = parsePlainTextMessage(messageContent);
            }

            // Guardar datos en la base de datos
            if (sensorData.temperature !== undefined) {
              console.log(`Guardando temperatura (${queue}):`, sensorData.temperature);
              await temperatureService.saveTemperatureData(sensorData.temperature);
            }
            if (sensorData.humidity !== undefined) {
              console.log(`Guardando humedad (${queue}):`, sensorData.humidity);
              await humidityService.saveHumidityData(sensorData.humidity);
            }

            // Enviar datos al WebSocket con una etiqueta específica para cada cola
            websocketServer.broadcast({
              queue, // Identifica la cola de origen
              data: sensorData,
            });
          } catch (error) {
            console.error("Error al procesar el mensaje:", error);
          } finally {
            // Confirmar el mensaje procesado
            channel.ack(msg);
          }
        }
      });
    }

    connection.on("close", () => {
      console.error("Conexión a RabbitMQ cerrada. Reintentando...");
      setTimeout(connectToRabbitMQ, 5000);
    });

    connection.on("error", (error) => {
      console.error("Error en la conexión a RabbitMQ:", error);
    });
  } catch (error) {
    console.error("Error al conectar a RabbitMQ:", error);
    setTimeout(connectToRabbitMQ, 5000);
  }
}

// Función para analizar mensajes en texto plano
function parsePlainTextMessage(message: string) {
  const temperatureMatch = message.match(/Temperatura:\s*([\d.]+)/);
  const humidityMatch = message.match(/Humedad:\s*([\d.]+)/);

  return {
    temperature: temperatureMatch ? parseFloat(temperatureMatch[1]) : undefined,
    humidity: humidityMatch ? parseFloat(humidityMatch[1]) : undefined,
  };
}

// Iniciar conexión a RabbitMQ
connectToRabbitMQ();