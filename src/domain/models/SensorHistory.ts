import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class SensorHistory extends Model {
  public id!: number;
  public timestamp!: Date;
  public temperature!: number;
  public humidity!: number;
}

SensorHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'sensor_history',
    timestamps: false,
  }
);

export default SensorHistory;
