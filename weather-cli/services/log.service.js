import chalk from "chalk";
import dedent from "dedent-js";

const MESSAGES = {
  ru: {
    weatherTitle: "Погода в городе",
    temperature: "Температура",
    feelsLike: "ощущается как",
    humidity: "Влажность",
    windSpeed: "Скорость ветра"
  },
  en: {
    weatherTitle: "Weather in",
    temperature: "Temperature",
    feelsLike: "feels like",
    humidity: "Humidity",
    windSpeed: "Wind speed"
  }
};

const printWeather = (res, icon, lang = 'ru') => {
  const t = MESSAGES[lang] || MESSAGES.ru;

  console.log(
    dedent`${chalk.bgYellow(" WEATHER ")} ${t.weatherTitle} ${res.name}
    ${icon}  ${res.weather[0].description}
    ${t.temperature}: ${res.main.temp} (${t.feelsLike} ${res.main.feels_like})
    ${t.humidity}: ${res.main.humidity}%
    ${t.windSpeed}: ${res.wind.speed} m/s
    `
  );
};

const printError = (msg) => {
  console.log(chalk.bgRed.black(" ERROR "), chalk.red(msg));
};

const printSuccess = (msg) => {
  console.log(chalk.bgGreen.black(" SUCCESS "), chalk.green(msg));
};

const printHelp = () => {
  console.log(
    dedent`${chalk.bgCyan.black(" HELP ")}
    Без параметров — показать погоду во всех сохранённых городах
    -s [CITY]   — добавить город для отслеживания
    -t [API_KEY] — сохранить API-ключ OpenWeather
    -l [ru|en]  — установить язык интерфейса
    -h          — показать эту справку
    `
  );
};

export { printError, printSuccess, printHelp, printWeather };