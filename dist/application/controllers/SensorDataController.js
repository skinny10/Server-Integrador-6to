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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorDataController = void 0;
class SensorDataController {
    constructor(temperatureService, temperatureService2, humidityService, humidityService2) {
        this.temperatureService = temperatureService;
        this.temperatureService2 = temperatureService2;
        this.humidityService = humidityService;
        this.humidityService2 = humidityService2;
    }
    handleTemperatureData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = req.body;
            yield this.temperatureService.saveTemperatureData(value);
            res.status(200).send('Temperature data saved');
        });
    }
    handleTemperature2Data(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = req.body;
            yield this.temperatureService2.saveTemperature2Data(value);
            res.status(200).send('Temperature data saved');
        });
    }
    handleHumidityData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = req.body;
            yield this.humidityService.saveHumidityData(value);
            res.status(200).send('Humidity data saved');
        });
    }
    handleHumidity2Data(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { value } = req.body;
            yield this.humidityService2.saveHumidityData(value);
            res.status(200).send('Humidity data saved');
        });
    }
}
exports.SensorDataController = SensorDataController;
//# sourceMappingURL=SensorDataController.js.map