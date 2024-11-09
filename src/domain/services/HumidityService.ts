import { SensorDataRepository } from '../repositories/InMemorySensorDataRepository';

export class HumidityService {
    private repository: SensorDataRepository;

    constructor(repository: SensorDataRepository) {
        this.repository = repository;
    }

    public async saveHumidityData(value: number): Promise<void> {
        await this.repository.saveSensorData({ type: 'humidity', value, timestamp: new Date() });
    }
}
