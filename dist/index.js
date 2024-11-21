"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const amqplib_1 = __importDefault(require("amqplib"));
const database_1 = __importDefault(require("./config/database"));
const TemperatureService_1 = require("./domain/services/TemperatureService");
const TemperatureService2_1 = require("./domain/services/TemperatureService2");
const HumidityService2_1 = require("./domain/services/HumidityService2");
const HumidityService_1 = require("./domain/services/HumidityService");
const SensorDataController_1 = require("./application/controllers/SensorDataController");
const webSocketServer_1 = __importDefault(require("./infrastructure/websocket/webSocketServer"));
const app = (0, express_1.default)();
const port = 3000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));
app.use(body_parser_1.default.json());
// Configuración de Sequelize
database_1.default
    .sync()
    .then(() => {
    console.log('Conectado a MySQL y modelos sincronizados.');
})
    .catch((error) => {
    console.error('Error al conectar a MySQL:', error);
});
// Instancia de servicios y controlador
const temperatureService = new TemperatureService_1.TemperatureService();
const temperatureService2 = new TemperatureService2_1.TemperatureService2();
const humidityService = new HumidityService_1.HumidityService();
const humidityService2 = new HumidityService2_1.HumidityService2();
const sensorDataController = new SensorDataController_1.SensorDataController(temperatureService, temperatureService2, humidityService, humidityService2);
// Rutas de API
app.post('/temperature', (req, res) => sensorDataController.handleTemperatureData(req, res));
app.post('/temperature2', (req, res) => sensorDataController.handleTemperatureData(req, res));
app.post('/humidity', (req, res) => sensorDataController.handleHumidityData(req, res));
app.post('/humidity2', (req, res) => sensorDataController.handleHumidityData(req, res));
// Configuración de WebSocket
const websocketServer = new webSocketServer_1.default(server);
// Configuración de RabbitMQ
const rabbitSettings = {
    protocol: 'amqp',
    hostname: '35.153.235.110',
    port: 5672,
    username: 'angel',
    password: 'angel123',
    vhost: '/',
};
function connectToRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Intentando conectar a RabbitMQ...");
            const connection = yield amqplib_1.default.connect(rabbitSettings);
            console.log("Conexión exitosa a RabbitMQ.");
            const channel = yield connection.createChannel();
            const queues = ["mqtt", "mqtt2"];
            for (const queue of queues) {
                yield channel.assertQueue(queue, { durable: true });
                console.log(`Esperando mensajes en la cola: ${queue}`);
                channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                    if (msg) {
                        const messageContent = msg.content.toString();
                        console.log(`Mensaje recibido desde RabbitMQ en ${queue}:`, messageContent);
                        try {
                            let sensorData;
                            // Verificar si el mensaje es un JSON válido
                            if (messageContent.trim().startsWith("{")) {
                                // Intentar parsear como JSON
                                sensorData = JSON.parse(messageContent);
                            }
                            else {
                                // Analizar el texto plano
                                sensorData = parsePlainTextMessage(messageContent);
                            }
                            // Guardar datos en la base de datos
                            if (sensorData.temperature !== undefined) {
                                console.log(`Guardando temperatura (${queue}):`, sensorData.temperature);
                                yield temperatureService.saveTemperatureData(sensorData.temperature);
                            }
                            if (sensorData.humidity !== undefined) {
                                console.log(`Guardando humedad (${queue}):`, sensorData.humidity);
                                yield humidityService.saveHumidityData(sensorData.humidity);
                            }
                            // Enviar datos al WebSocket con una etiqueta específica para cada cola
                            websocketServer.broadcast({
                                queue, // Identifica la cola de origen
                                data: sensorData,
                            });
                        }
                        catch (error) {
                            console.error("Error al procesar el mensaje:", error);
                        }
                        finally {
                            // Confirmar el mensaje procesado
                            channel.ack(msg);
                        }
                    }
                }));
            }
            connection.on("close", () => {
                console.error("Conexión a RabbitMQ cerrada. Reintentando...");
                setTimeout(connectToRabbitMQ, 5000);
            });
            connection.on("error", (error) => {
                console.error("Error en la conexión a RabbitMQ:", error);
            });
        }
        catch (error) {
            console.error("Error al conectar a RabbitMQ:", error);
            setTimeout(connectToRabbitMQ, 5000);
        }
    });
}
// Función para analizar mensajes en texto plano
function parsePlainTextMessage(message) {
    const temperatureMatch = message.match(/Temperatura:\s*([\d.]+)/);
    const humidityMatch = message.match(/Humedad:\s*([\d.]+)/);
    return {
        temperature: temperatureMatch ? parseFloat(temperatureMatch[1]) : undefined,
        humidity: humidityMatch ? parseFloat(humidityMatch[1]) : undefined,
    };
}
// Iniciar conexión a RabbitMQ
connectToRabbitMQ();
//# sourceMappingURL=index.js.map