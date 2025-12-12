// timer.js
const { performance } = require('perf_hooks');

// Функция для парсинга строки вида "1h 5m 10s"
function parseTime(input) {
  const regex = /(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s)?/;
  const matches = input.trim().match(regex);

  if (!matches) {
    throw new Error('Неверный формат времени');
  }

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  if (hours < 0 || minutes < 0 || seconds < 0) {
    throw new Error('Время не может быть отрицательным');
  }

  return (hours * 3600 + minutes * 60 + seconds) * 1000; // в миллисекундах
}

// Функция для красивого отображения оставшегося времени
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}ч`);
  if (minutes > 0) parts.push(`${minutes}м`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}с`);

  return parts.join(' ');
}

function startTimer(durationMs) {
  if (durationMs <= 0) {
    console.log('Время должно быть больше нуля!');
    process.exit(1);
  }

  const startTime = performance.now();
  const endTime = startTime + durationMs;

  console.log(`⏱️ Таймер запущен на ${formatTime(durationMs)}`);
  console.log('Ожидание завершения...\n');

  const interval = setInterval(() => {
    const now = performance.now();
    const remaining = endTime - now;

    if (remaining <= 0) {
      clearInterval(interval);
      console.log('\n🔔 Время вышло! Звонок!');
      process.exit(0);
    }

    process.stdout.write(`\r⏱️ Осталось: ${formatTime(remaining)}`);
  }, 200); 

  process.on('SIGINT', () => {
    console.log('\n\nТаймер остановлен пользователем.');
    process.exit(0);
  });
}

// Запуск приложения
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    process.exit(1);
  }

  const input = args.join(' ');
  try {
    const durationMs = parseTime(input);
    startTimer(durationMs);
  } catch (err) {
    console.error('Ошибка:', err.message);
    process.exit(1);
  }
}

main();