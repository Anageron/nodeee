const [num1Str, num2Str, operation] = process.argv.slice(2);

// Проверка количества аргументов
if (process.argv.length !== 5) {
  console.error('Usage: node index.js <number1> <number2> <operation>');
  console.error('Available operations: add, subtract, multiply, divide');
  process.exit(1);
}

const num1 = Number(num1Str);
const num2 = Number(num2Str);

// Проверка, что аргументы — числа
if (isNaN(num1) || isNaN(num2)) {
  console.error('Error: Both arguments must be valid numbers');
  process.exit(1);
}

// Карта операций
const operations = {
  add: require('./add'),
  subtract: require('./subtract'),
  multiply: require('./multiply'),
  divide: require('./divide')
};

// Проверка, поддерживается ли операция
if (!operations[operation]) {
  console.error(`Error: Unsupported operation "${operation}"`);
  console.error('Available operations: add, subtract, multiply, divide');
  process.exit(1);
}

// Выполнение операции
try {
  const result = operations[operation](num1, num2);
  console.log(result);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}