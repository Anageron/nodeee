import { homedir } from 'os';
import { join } from 'path';
import { promises as fs } from 'fs';
import type { Lang } from '../types.js';

interface Config {
  token: string | null;
  settings: {
    lang: Lang;
  };
  cities: string[];
}

const filePath = join(homedir(), 'weather-data.json');

const DEFAULT_CONFIG: Config = {
  token: null,
  settings: { lang: 'ru' },
  cities: [],
};

const readConfig = async (): Promise<Config> => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data) as Partial<Config>;

    // Защита от повреждённых данных
    return {
      token: typeof parsed.token === 'string' ? parsed.token : null,
      settings: {
        lang: parsed.settings?.lang === 'en' ? 'en' : 'ru',
      },
      cities: Array.isArray(parsed.cities)
        ? parsed.cities.filter((c): c is string => typeof c === 'string')
        : [],
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
};

const writeConfig = async (config: Config): Promise<void> => {
  await fs.writeFile(filePath, JSON.stringify(config, null, 2));
};

export const saveToken = async (token: string): Promise<void> => {
  const config = await readConfig();
  config.token = token;
  await writeConfig(config);
};

export const saveLang = async (lang: Lang): Promise<void> => {
  const config = await readConfig();
  config.settings.lang = lang;
  await writeConfig(config);
};

export const addCity = async (city: string): Promise<void> => {
  const config = await readConfig();
  if (!config.cities.includes(city)) {
    config.cities.push(city);
    await writeConfig(config);
  }
};

export const getCities = async (): Promise<string[]> => {
  const config = await readConfig();
  return config.cities;
};

export const getToken = async (): Promise<string | null> => {
  const config = await readConfig();
  return config.token;
};

export const getLang = async (): Promise<Lang> => {
  const config = await readConfig();
  return config.settings.lang;
};