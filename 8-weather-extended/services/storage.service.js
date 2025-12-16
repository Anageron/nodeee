import { homedir } from "os";
import { join } from "path";
import { promises as fs } from "fs";

const filePath = join(homedir(), "weather-data.json");

const DEFAULT_CONFIG = {
  token: null,
  settings: {
    lang: "ru",
  },
  cities: [],
};

const readConfig = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(data);
    // Обеспечиваем совместимость
    if (!parsed.settings) parsed.settings = { lang: "ru" };
    if (!parsed.cities) parsed.cities = [];
    return parsed;
  } catch {
    return { ...DEFAULT_CONFIG };
  }
};

const writeConfig = async (config) => {
  await fs.writeFile(filePath, JSON.stringify(config, null, 2));
};

const saveToken = async (token) => {
  const config = await readConfig();
  config.token = token;
  await writeConfig(config);
};

const saveLang = async (lang) => {
  const config = await readConfig();
  config.settings.lang = lang;
  await writeConfig(config);
};

const addCity = async (city) => {
  const config = await readConfig();
  if (!config.cities.includes(city)) {
    config.cities.push(city);
    await writeConfig(config);
  }
};

const getCities = async () => {
  const config = await readConfig();
  return config.cities;
};

const getToken = async () => {
  const config = await readConfig();
  return config.token;
};

const getLang = async () => {
  const config = await readConfig();
  return config.settings.lang || "ru";
};

export { saveToken, saveLang, addCity, getCities, getLang, getToken };
