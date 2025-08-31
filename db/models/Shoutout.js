'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Shoutout extends Model {
    static associate(models) {}
  }

  Shoutout.init(
    {
      cheerName: DataTypes.STRING,
      signText: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Shoutout',
      tableName: 'Shoutouts',
    },
  );

  return Shoutout;
};
