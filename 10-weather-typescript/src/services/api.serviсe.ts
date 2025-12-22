import axios, { AxiosError } from 'axios';
import type { WeatherResponse, Lang } from '../types.js';
import { getToken } from './storage.service.js';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getIcon = (icon: string): string => {
  const code = icon.slice(0, -1); // убираем 'd' или 'n'
  switch (code) {
    case '01': return '☀️';
    case '02': return '🌤️';
    case '03': return '☁️';
    case '04': return '☁️';
    case '09': return '🌧️';
    case '10': return '🌦️';
    case '11': return '⛈️';
    case '13': return '❄️';
    case '50': return '🌫️';
    default: return '🌡️';
  }
};

export const getWeather = async (city: string, lang: Lang = 'ru'): Promise<WeatherResponse> => {
  const token = await getToken();
  if (!token) {
    throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
  }

  try {
    const { data } = await axios.get<WeatherResponse>(API_URL, {
      params: {
        q: city,
        appid: token,
        lang,
        units: 'metric',
      },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Пробрасываем ошибку как есть — обработка уровнем выше
      throw error;
    }
    throw error;
  }
};