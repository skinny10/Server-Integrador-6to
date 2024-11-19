import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class SensorData extends Model {
  public id!: number;
  public type!: string;
  public value!: number;
  public timestamp!: Date;
}

SensorData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT, // Para valores numéricos con decimales
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'sensor_data',
    timestamps: false,
  }
);

export default SensorData;
