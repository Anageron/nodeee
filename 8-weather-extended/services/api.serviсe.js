import axios from 'axios';
import { getToken } from './storage.service.js';

const getIcon = (icon) => {
  switch (icon.slice(0, -1)) {
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

const getWeather = async (city, lang = 'ru') => {
  const token = await getToken();
  if (!token) {
    throw new Error('Не задан ключ API, задайте его через команду -t [API_KEY]');
  }

  const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: city,
      appid: token,
      lang: lang,
      units: 'metric'
    }
  });
  return data;
};

export { getWeather, getIcon };