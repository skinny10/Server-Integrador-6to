import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('integrador', 'Angel', '1980', {
  host: '3.211.211.55',
  dialect: 'mysql',
});

export default sequelize;
