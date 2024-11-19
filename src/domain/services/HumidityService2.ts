import SensorData from '../models/SensorDataModel';

export class HumidityService2 {
  public async saveHumidityData(value: number): Promise<void> {
    await SensorData.create({
      type: 'humidity',
      value,
    });
  }
}
