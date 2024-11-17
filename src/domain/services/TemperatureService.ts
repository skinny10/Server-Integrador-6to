import { SensorDataModel } from "../models/SensorDataModel";

export class TemperatureService {
  // Método para guardar datos de temperatura
  public async saveTemperatureData(value: number): Promise<void> {
    const temperatureData = new SensorDataModel({
      type: 'temperature',
      value,
    });
    await temperatureData.save();
  }

  // Método para obtener la última temperatura registrada
  public async getLatestTemperature(): Promise<number> {
    const latestData = await SensorDataModel.findOne({ type: 'temperature' })
      .sort({ createdAt: -1 }) // Aseguramos que ordene por la fecha de creación descendente
      .exec(); // Agregamos .exec() para mayor compatibilidad con promesas

    // Validamos el valor y aseguramos que no retorne null
    return latestData?.value ?? 0; // Devolver 0 si no hay datos o el valor es null
  }
}
