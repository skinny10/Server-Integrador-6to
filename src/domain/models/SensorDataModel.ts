import mongoose, { Schema, Document } from 'mongoose';

interface ISensorData extends Document {
  type: string;
  value: number;
  timestamp: Date;
}

const SensorDataSchema: Schema = new Schema({
  type: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SensorDataModel = mongoose.model<ISensorData>('SensorData', SensorDataSchema);

export { SensorDataModel, ISensorData };
