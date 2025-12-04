const calculatorEmitter = require('../calculatorEmitter');

calculatorEmitter.on('add', (a, b) => {
  calculatorEmitter.emit('result', a + b);
});