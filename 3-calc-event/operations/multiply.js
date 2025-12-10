const calculatorEmitter = require('../calculatorEmitter');

calculatorEmitter.on('multiply', (a, b) => {
  calculatorEmitter.emit('result', a * b);
});