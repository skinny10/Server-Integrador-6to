import { SensorDataModel } from "../models/SensorDataModel";

export class TemperatureService2 {
  // Método para guardar datos de temperatura
  public async saveTemperature2Data(value: number): Promise<void> {
    const temperature2Data = new SensorDataModel({
      type: 'temperature2',
      value,
    });
    await temperature2Data.save();
  }

  
  public async getLatestTemperature2(): Promise<number> {
    const latestData = await SensorDataModel.findOne({ type: 'temperature2' })
      .sort({ createdAt: -1 }) 
      .exec(); 

    // Validamos el valor y aseguramos que no retorne null
    return latestData?.value ?? 0; // Devolver 0 si no hay datos o el valor es null
  }
}
