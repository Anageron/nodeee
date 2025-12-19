#!/usr/bin/env node

import { getArgs } from "./helpers/args.js";
import { getWeather, getIcon } from "../src/services/api.serviсe.js";
import {
  printError,
  printHelp,
  printSuccess,
  printWeather,
} from "./services/log.service.js";
import {
  saveToken,
  saveLang,
  addCity,
  getCities,
  getLang,
  getToken,
} from "./services/storage.service.js";
import type { Lang } from "./types.js";
import axios from "axios";

const handleSaveToken = async (token: string): Promise<void> => {
  try {
    await saveToken(token);
    printSuccess("Токен сохранён");
  } catch (e) {
    printError(e instanceof Error ? e.message : "Неизвестная ошибка");
  }
};

const handleAddCity = async (city: string): Promise<void> => {
  try {
    await addCity(city);
    printSuccess(`Город "${city}" добавлен`);
  } catch (e) {
    printError(e instanceof Error ? e.message : "Неизвестная ошибка");
  }
};

const handleSetLang = async (lang: string): Promise<void> => {
  if (lang !== "ru" && lang !== "en") {
    printError("Язык должен быть 'ru' или 'en'");
    return;
  }
  try {
    await saveLang(lang);
    const langName = lang === "ru" ? "русский" : "английский";
    printSuccess(`Язык установлен: ${langName}`);
  } catch (e) {
    printError(e instanceof Error ? e.message : "Неизвестная ошибка");
  }
};

const showWeatherForAllCities = async (): Promise<void> => {
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
      const firstWeather = weather.weather[0];
      if (!firstWeather) {
        printError(`Нет данных о погоде для ${city}`);
        continue;
      }
      printWeather(weather, getIcon(firstWeather.icon), lang);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          printError(`Город не найден: ${city}`);
        } else if (error.response?.status === 401) {
          printError("Неверный API-ключ");
          return;
        } else {
          printError(
            `Ошибка для ${city}: ${error.message || "неизвестная ошибка"}`
          );
        }
      } else {
        printError(
          `Неожиданная ошибка для ${city}: ${
            error instanceof Error ? error.message : "неизвестно"
          }`
        );
      }
    }
  }
};

const initCli = async (): Promise<void> => {
  const args = getArgs(process.argv);

  if (args.h) {
    printHelp();
    return;
  }

  if (args.t !== undefined) {
    await handleSaveToken(args.t);
    return;
  }

  if (args.s !== undefined) {
    await handleAddCity(args.s);
    return;
  }

  if (args.l !== undefined) {
    await handleSetLang(args.l);
    return;
  }

  await showWeatherForAllCities();
};

initCli().catch((e) => {
  printError(e instanceof Error ? e.message : "Критическая ошибка");
});
