const express = require('express');
const morgan = require('morgan');

const app = express();

// Подключаем логирование деталей запросов.
app.use(morgan('dev'));
// Распознавание входящего объекта в POST-запросе в виде строк или массивов
app.use(express.urlencoded({ extended: true }));
// Распознавание входящего объекта в POST-запросе как объекта JSON
app.use(express.json());

module.exports = app;
