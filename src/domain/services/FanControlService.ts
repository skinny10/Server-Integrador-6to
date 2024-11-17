import { TemperatureService } from './TemperatureService';
import { TemperatureService2 } from './TemperatureService2';
import WebSocketServer from '../../infrastructure/websocket/webSocketServer';

export class FanControlService {
    private temperatureService: TemperatureService;
    private temperatureService2: TemperatureService2;
    private webSocketServer: WebSocketServer;
    private isUVLightActive: boolean = false;

    constructor(
        temperatureService: TemperatureService,
        temperatureService2: TemperatureService2,
        webSocketServer: WebSocketServer
    ) {
        this.temperatureService = temperatureService;
        this.temperatureService2 = temperatureService2;
        this.webSocketServer = webSocketServer;
    }

    public async checkAndActivateFans(): Promise<void> {
        const tempInside = await this.temperatureService.getLatestTemperature();
        const tempOutside = await this.temperatureService2.getLatestTemperature2();

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
        } else {
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
    }

    private activateUVLight(): void {
        this.isUVLightActive = true;
        console.log('Luz UV activada para desinfección del aire entrante.');
    }

    private deactivateUVLight(): void {
        this.isUVLightActive = false;
        console.log('Luz UV desactivada.');
    }

    public isUVLightOn(): boolean {
        return this.isUVLightActive;
    }
}