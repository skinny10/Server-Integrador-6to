import SensorData from "../models/SensorDataModel";

export class TemperatureService {
  // Método para guardar datos de temperatura
  public async saveTemperatureData(value: number): Promise<void> {
    await SensorData.create({
      type: "temperature",
      value,
    });
  }

  // Método para obtener la última temperatura registrada
  public async getLatestTemperature(): Promise<number> {
    const latestData = await SensorData.findOne({
      where: { type: "temperature" },
      order: [["timestamp", "DESC"]], // Ordenar por timestamp en orden descendente
    });

    // Validamos el valor y aseguramos que no retorne null
    return latestData?.value ?? 0; // Devolver 0 si no hay datos o el valor es null
  }
}
