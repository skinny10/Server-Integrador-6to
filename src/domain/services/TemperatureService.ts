import { SensorDataRepository } from '../repositories/InMemorySensorDataRepository';

export class TemperatureService {
    private repository: SensorDataRepository;

    constructor(repository: SensorDataRepository) {
        this.repository = repository;
    }

    public async saveTemperatureData(value: number): Promise<void> {
        await this.repository.saveSensorData({ type: 'temperature', value, timestamp: new Date() });
    }
}
