import mongoose, { Schema, Document } from 'mongoose';

// Define la interfaz con múltiples tipos para `value`
interface ISensorData extends Document {
  type: string;
  value: number; // Soporta números y cadenas
  timestamp: Date;
}

// Define el esquema con Mixed, pero especifica los posibles tipos en la interfaz
const SensorDataSchema: Schema = new Schema({
  type: { type: String, required: true },
  value: { type: Number, required: true }, // Forzamos a que sea un número y no nulo
  timestamp: { type: Date, default: Date.now },
});


const SensorDataModel = mongoose.model<ISensorData>('SensorData', SensorDataSchema);

export { SensorDataModel, ISensorData };
