import { Request, Response } from 'express';
import { TemperatureService } from '../../domain/services/TemperatureService';
import { TemperatureService2 } from '../../domain/services/TemperatureService2';
import { HumidityService } from '../../domain/services/HumidityService';
import { HumidityService2 } from '../../domain/services/HumidityService2';


export class SensorDataController {
    private temperatureService: TemperatureService;
    private temperatureService2: TemperatureService2;
    private humidityService: HumidityService;
    private humidityService2: HumidityService2;

    constructor(
        temperatureService: TemperatureService,
        temperatureService2: TemperatureService2,
        humidityService: HumidityService,
        humidityService2: HumidityService2,

    ) {
        this.temperatureService = temperatureService;
        this.temperatureService2 = temperatureService2;
        this.humidityService = humidityService;
        this.humidityService2 = humidityService2;

    }

    public async handleTemperatureData(req: Request, res: Response): Promise<void> {
        const { value } = req.body;
        await this.temperatureService.saveTemperatureData(value);
        res.status(200).send('Temperature data saved');
    }

    public async handleTemperature2Data(req: Request, res: Response): Promise<void> {
        const { value } = req.body;
        await this.temperatureService2.saveTemperature2Data(value);
        res.status(200).send('Temperature data saved');
    }

    public async handleHumidityData(req: Request, res: Response): Promise<void> {
        const { value } = req.body;
        await this.humidityService.saveHumidityData(value);
        res.status(200).send('Humidity data saved');
    }

    public async handleHumidity2Data(req: Request, res: Response): Promise<void> {
        const { value } = req.body;
        await this.humidityService2.saveHumidity2Data(value);
        res.status(200).send('Humidity data saved');
    }

}
