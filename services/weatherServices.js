const axios = require("axios");

async function getWeather(city) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=-26.236&longitude=28.36&current_weather=true`
    );

    return {
      city,
      temperature: response.data.current_weather.temperature,
      windspeed: response.data.current_weather.windspeed,
      time: response.data.current_weather.time
    };
  } catch (error) {
    console.error("API Error:", error.message);
    throw new Error("Unable to retrieve weather data.");
  }
}

module.exports = { getWeather };
