import axios from "axios";

const API_KEY = "e275f61f9f808729bbe9951e09463e45";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherForCity = async (cityName) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
};
