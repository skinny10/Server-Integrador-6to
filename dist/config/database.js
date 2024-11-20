"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('integrador', 'Angel', '1980', {
    host: '3.211.211.55',
    dialect: 'mysql',
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map