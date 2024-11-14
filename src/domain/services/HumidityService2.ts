import { SensorDataModel } from "../models/SensorDataModel";

export class HumidityService2 {
    public async saveHumidity2Data(value: number): Promise<void> {
      const humidityData = new SensorDataModel({
        type: 'humidity2',
        value,
      });
      await humidityData.save();
    }
  }