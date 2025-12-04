const calculatorEmitter = require('./calculatorEmitter');

// Подключаем все операции (они автоматически подписываются на события)
require('./operations/add');
require('./operations/subtract');
require('./operations/multiply');
require('./operations/divide');

// Обработчик результата
calculatorEmitter.on('result', (value) => {
  console.log(value);
  process.exit(0);
});

// Обработчик ошибок
calculatorEmitter.on('error', (message) => {
  console.error(`Error: ${message}`);
  process.exit(1);
});

// Извлекаем аргументы
const [num1Str, num2Str, operation] = process.argv.slice(2);

// Валидация аргументов
if (process.argv.length !== 5) {
  console.error('Usage: node index.js <number1> <number2> <operation>');
  console.error('Available operations: add, subtract, multiply, divide');
  process.exit(1);
}

const num1 = Number(num1Str);
const num2 = Number(num2Str);

if (isNaN(num1) || isNaN(num2)) {
  calculatorEmitter.emit('error', 'Both arguments must be valid numbers');
}

// Проверка поддерживаемых операций
const validOperations = ['add', 'subtract', 'multiply', 'divide'];
if (!validOperations.includes(operation)) {
  calculatorEmitter.emit('error', `Unsupported operation: ${operation}. Use: ${validOperations.join(', ')}`);
}

// Запускаем вычисление через событие
calculatorEmitter.emit(operation, num1, num2);