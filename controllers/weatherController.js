const { getWeather } = require("../services/weatherServices");

exports.weatherAPI = async (req, res) => {
  const { city } = req.query; // e.g. /api/weather?city=Johannesburg
  try {
    const weather = await getWeather(city);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

