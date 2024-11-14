// src/domain/services/TemperatureService2.ts
import { SensorDataModel } from "../models/SensorDataModel";

export class TemperatureService2 {
  public async saveTemperature2Data(value: number): Promise<void> {
    const temperatureData = new SensorDataModel({
      type: 'temperature2',
      value,
    });
    await temperatureData.save();
  }
}
