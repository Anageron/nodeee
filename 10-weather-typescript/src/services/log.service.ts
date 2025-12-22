import chalk from 'chalk';
import dedent from 'dedent-js';
import type { WeatherResponse, Lang } from '../types.js';

const MESSAGES = {
  ru: {
    weatherTitle: 'Погода в городе',
    temperature: 'Температура',
    feelsLike: 'ощущается как',
    humidity: 'Влажность',
    windSpeed: 'Скорость ветра',
  },
  en: {
    weatherTitle: 'Weather in',
    temperature: 'Temperature',
    feelsLike: 'feels like',
    humidity: 'Humidity',
    windSpeed: 'Wind speed',
  },
} as const;

export const printWeather = (res: WeatherResponse, icon: string, lang: Lang = 'ru'): void => {
  const t = MESSAGES[lang];
    const weather = res.weather[0];
    if (!weather) {
    printError('Нет данных о погоде');
    return;
  }

  console.log(
    dedent`${chalk.bgYellow(' WEATHER ')} ${t.weatherTitle} ${res.name}
    ${icon}  ${weather.description}
    ${t.temperature}: ${res.main.temp} (${t.feelsLike} ${res.main.feels_like})
    ${t.humidity}: ${res.main.humidity}%
    ${t.windSpeed}: ${res.wind.speed} m/s
    `
  );
};

export const printError = (msg: string): void => {
  console.log(chalk.bgRed.black(' ERROR '), chalk.red(msg));
};

export const printSuccess = (msg: string): void => {
  console.log(chalk.bgGreen.black(' SUCCESS '), chalk.green(msg));
};

export const printHelp = (): void => {
  console.log(
    dedent`${chalk.bgCyan.black(' HELP ')}
    Без параметров — показать погоду во всех сохранённых городах
    -s [CITY]   — добавить город для отслеживания
    -t [API_KEY] — сохранить API-ключ OpenWeather
    -l [ru|en]  — установить язык интерфейса
    -h          — показать эту справку
    `
  );
};