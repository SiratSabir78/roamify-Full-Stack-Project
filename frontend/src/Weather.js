import axios from "axios";
const API_KEY = "e275f61f9f808729bbe9951e09463e45";
export const getWeatherForCity = async (cityName) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error);
    return null;
  }
};
