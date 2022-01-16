const axios = require("axios");
const dotenv = require("dotenv").config();
const colors = require("colors");
const { format } = require("date-fns");

//*------------------

const { API_KEY: key } = process.env;
const args = process.argv;

const [, , cityName, unit] = args;

const displayUnit = unit === "metric" ? "\u00B0C" : "\u00B0F";

const url_current = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=${unit}`;

const url_forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${key}&units=${unit}`;

const getCurrentWeather = async () => {
  const response = await axios.get(url_current);
  const {
    name,
    sys: { country },
    main: { temp },
    weather: [{ description }],
  } = response.data;
  return {
    name: name,
    country: country,
    temp: temp.toFixed(0),
    weather: description,
  };
};

getCurrentWeather()
  .then((response) => {
    console.log(
      `
It is now ${response.temp}${displayUnit} in ${response.name}, ${response.country}.
The current weather conditions are: ${response.weather}.`.bold
    );
  })
  .catch(() => {
    console.log("Failed to read. Possible solution: provide city and units");
  });

//* --------------- BONUS

const getForecast = async () => {
  const response = await axios.get(url_forecast);
  return response.data;
};

getForecast()
  .then((response) => {
    console.log("\n5 days forecast at noon:".magenta.bold + "\n");
    response.list.map((e) => {
      const date = new Date(e.dt * 1000);
      if (date.getUTCHours() === 12) {
        console.log(
          `${format(date, "EEEE, do MMM")}`.bgBrightMagenta.black +
            ` ${e.main.temp.toFixed(0)}${displayUnit}, ${
              e.weather[0].description
            }
       `
        );
      }
    });
  })
  .catch(() => {
    console.log("Failed to read.");
  });

// $ node index Reykjavik metric
// expected output:
// It is now 7°C in Reykjavik, IS.
// The current weather conditions are: broken clouds.

// 5 days forecast at noon:

// Wednesday 27/10:  6°C, light rain

// Thursday 28/10:  6°C, broken clouds

// Friday 29/10:  6°C, broken clouds

// Saturday 30/10:  4°C, broken clouds

// Sunday 31/10:  3°C, overcast clouds

// $ node index "New York" imperial
// It is now 58°F in New York, US.
// The current weather conditions are: moderate rain.
