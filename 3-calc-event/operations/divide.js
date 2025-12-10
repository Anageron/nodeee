const calculatorEmitter = require('../calculatorEmitter');

calculatorEmitter.on('divide', (a, b) => {
  if (b === 0) {
    calculatorEmitter.emit('error', 'Division by zero');
    return;
  }
  calculatorEmitter.emit('result', a / b);
});