const calculatorEmitter = require('../calculatorEmitter');

calculatorEmitter.on('subtract', (a, b) => {
  calculatorEmitter.emit('result', a - b);
});