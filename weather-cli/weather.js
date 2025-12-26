#!/usr/bin/env node

import { getArgs } from "./helpers/args.js";
import { getWeather, getIcon } from "./services/api.serviсe.js";
import { printError, printHelp, printSuccess, printWeather } from "./services/log.service.js";
import {
  saveToken,
  saveLang,
  addCity,
  getCities,
  getLang,
  getToken
} from "./services/storage.service.js";

const handleSaveToken = async (token) => {
  if (!token) {
    printError("Не передан токен");
    return;
  }
  try {
    await saveToken(token);
    printSuccess("Токен сохранён");
  } catch (e) {
    printError(e.message);
  }
};

const handleAddCity = async (city) => {
  if (!city) {
    printError("Не передан город");
    return;
  }
  try {
    await addCity(city);
    printSuccess(`Город "${city}" добавлен`);
  } catch (e) {
    printError(e.message);
  }
};

const handleSetLang = async (lang) => {
  if (!lang || !['ru', 'en'].includes(lang)) {
    printError("Язык должен быть 'ru' или 'en'");
    return;
  }
  try {
    await saveLang(lang);
    const langName = lang === 'ru' ? 'русский' : 'английский';
    printSuccess(`Язык установлен: ${langName}`);
  } catch (e) {
    printError(e.message);
  }
};

const showWeatherForAllCities = async () => {
  const token = await getToken();
  if (!token) {
    printError("Не задан API-ключ. Используйте -t [ключ]");
    return;
  }

  const lang = await getLang();
  const cities = await getCities();

  if (cities.length === 0) {
    printError("Нет сохранённых городов. Добавьте через -s [город]");
    return;
  }

  for (const city of cities) {
    try {
      const weather = await getWeather(city, lang);
      printWeather(weather, getIcon(weather.weather[0].icon), lang);
    } catch (error) {
      if (error?.response?.status === 404) {
        printError(`Город не найден: ${city}`);
      } else if (error?.response?.status === 401) {
        printError("Неверный API-ключ");
        return;
      } else {
        printError(`Ошибка для ${city}: ${error.message}`);
      }
    }
  }
};

const initCli = async () => {
  const args = getArgs(process.argv);

  if (args.h) {
    printHelp();
    return;
  }

  if (args.t) {
    await handleSaveToken(args.t);
    return;
  }

  if (args.s) {
    await handleAddCity(args.s);
    return;
  }

  if (args.l) {
    await handleSetLang(args.l);
    return;
  }

  await showWeatherForAllCities();
};

initCli().catch(console.error);