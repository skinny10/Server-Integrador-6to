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
exports.FanControlService = void 0;
class FanControlService {
    constructor(temperatureService, temperatureService2, webSocketServer) {
        this.isUVLightActive = false;
        this.temperatureService = temperatureService;
        this.temperatureService2 = temperatureService2;
        this.webSocketServer = webSocketServer;
    }
    checkAndActivateFans() {
        return __awaiter(this, void 0, void 0, function* () {
            const tempInside = yield this.temperatureService.getLatestTemperature();
            const tempOutside = yield this.temperatureService2.getLatestTemperature2();
            if (tempInside !== null && tempOutside !== null && tempInside > tempOutside) {
                console.log('Activando ventiladores: temperatura interna mayor que externa.');
                // Activar ventiladores y luz UV
                this.activateUVLight();
                // Enviar múltiples notificaciones
                this.webSocketServer.broadcast({
                    alerts: [
                        { type: 'fans', message: 'Ventiladores activados.' },
                        { type: 'uvlight', message: 'Luz UV activada para desinfección del aire.' }
                    ]
                });
            }
            else {
                console.log('Condiciones normales: no se activan ventiladores.');
                // Desactivar luz UV si estaba activa
                if (this.isUVLightActive) {
                    this.deactivateUVLight();
                    this.webSocketServer.broadcast({
                        alerts: [
                            { type: 'fans', message: 'Ventiladores desactivados.' },
                            { type: 'uvlight', message: 'Luz UV desactivada.' }
                        ]
                    });
                }
            }
        });
    }
    activateUVLight() {
        this.isUVLightActive = true;
        console.log('Luz UV activada para desinfección del aire entrante.');
    }
    deactivateUVLight() {
        this.isUVLightActive = false;
        console.log('Luz UV desactivada.');
    }
    isUVLightOn() {
        return this.isUVLightActive;
    }
}
exports.FanControlService = FanControlService;
//# sourceMappingURL=FanControlService.js.map