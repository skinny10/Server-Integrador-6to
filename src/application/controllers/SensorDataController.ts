import { Request, Response } from 'express';
import { TemperatureService } from '../../domain/services/TemperatureService';
import { HumidityService } from '../../domain/services/HumidityService';


export class SensorDataController {
    private temperatureService: TemperatureService;
    private humidityService: HumidityService;

    constructor(
        temperatureService: TemperatureService,
        humidityService: HumidityService,

    ) {
        this.temperatureService = temperatureService;
        this.humidityService = humidityService;
    }

    public async handleTemperatureData(req: Request, res: Response): Promise<void> {
        const { value } = req.body;
        await this.temperatureService.saveTemperatureData(value);
        res.status(200).send('Temperature data saved');
    }

    public async handleHumidityData(req: Request, res: Response): Promise<void> {
        const { value } = req.body;
        await this.humidityService.saveHumidityData(value);
        res.status(200).send('Humidity data saved');
    }

}
