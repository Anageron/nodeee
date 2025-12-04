const EventEmitter = require('events');
const calculatorEmitter = new EventEmitter();

// Экспортируем для использования в других модулях
module.exports = calculatorEmitter;