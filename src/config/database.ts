import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('raspdb', 'Angel', '1980', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
