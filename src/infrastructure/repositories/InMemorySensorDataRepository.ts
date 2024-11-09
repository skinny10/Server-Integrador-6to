import { SensorDataRepository } from '../../domain/repositories/InMemorySensorDataRepository';
import { SensorData } from '../../domain/entities/SensorData';

export class InMemorySensorDataRepository implements SensorDataRepository {
    private data: SensorData[] = [];

    async saveSensorData(data: SensorData): Promise<void> {
        this.data.push({ ...data, timestamp: new Date() });
    }

    async getAllSensorData(): Promise<SensorData[]> {
        return this.data;
    }
}
