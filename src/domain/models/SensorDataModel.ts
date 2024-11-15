import mongoose, { Schema, Document } from 'mongoose';

interface ISensorData extends Document {
  type: string;
  value: Schema.Types.Mixed,
  timestamp: Date;
}

const SensorDataSchema: Schema = new Schema({
  type: { type: String, required: true },
  value: Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
});

const SensorDataModel = mongoose.model<ISensorData>('SensorData', SensorDataSchema);

export { SensorDataModel, ISensorData };
