import SensorData from '../models/SensorDataModel';

export class HumidityService {
  public async saveHumidityData(value: number): Promise<void> {
    await SensorData.create({
      type: 'humidity',
      value,
    });
  }
}
