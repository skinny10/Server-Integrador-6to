import { SensorDataModel } from "../models/SensorDataModel";


export class HumidityService {
    public async saveHumidityData(value: number): Promise<void> {
      const humidityData = new SensorDataModel({
        type: 'humidity',
        value,
      });
      await humidityData.save();
    }
  }