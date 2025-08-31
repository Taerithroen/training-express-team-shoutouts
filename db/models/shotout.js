'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shotout extends Model {

    static associate(models) {
    
    }
  }
  Shotout.init({
    cheerName: DataTypes.STRING,
    signText: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shotout',
  });
  return Shotout;
};