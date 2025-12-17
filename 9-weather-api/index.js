import axios from "axios";
import express from "express";

const PORT = 8000;
const app = express();

const token = "7c56742779e6e5490d8dee54efa6b9f7";

const getWeather = async (city) => {
  const { data } = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: city,
        appid: token,
        lang: "ru",
        units: "metric",
      },
    }
  );
  console.log(data);
  return data;
};

app.get("/weather/:city", async (req, res) => {
  try {
    const cityName = req.params.city;
    console.log(cityName);
    const weatherData = await getWeather(cityName);
    console.log(weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error("Подробная ошибка:", error.message);
    console.error("Ответ API (если есть):", error.response?.data);
    console.error("Статус:", error.response?.status);
    if (error.response?.status === 404) {
      res.status(404).json({ error: "Город не найден" });
    } else if (error.message.includes("ключ API")) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Ошибка при получении погоды" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
