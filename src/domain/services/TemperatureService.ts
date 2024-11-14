import { SensorDataModel } from "../models/SensorDataModel";

export class TemperatureService {
  public async saveTemperatureData(value: number): Promise<void> {
    const temperatureData = new SensorDataModel({
      type: 'temperature',
      value,
    });
    await temperatureData.save();
  }
}
