import { SensorData } from '../entities/SensorData';

export interface SensorDataRepository {
    saveSensorData(data: SensorData): Promise<void>;
    getAllSensorData(): Promise<SensorData[]>;
}