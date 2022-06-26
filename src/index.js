//format current date and time
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return weekdays[date.getDay()];
}

function formatDate(timestamp) {
  let currentDate = new Date(timestamp * 1000);

  let date = {
    day: formatDay(timestamp),
    hours: currentDate.getHours().toString().padStart(2, 0),
    minutes: currentDate.getMinutes().toString().padStart(2, 0),
  };

  return `${date.day} ${date.hours}:${date.minutes}`;
}

// add a search engine
function clearCityValue() {
  let city = document.querySelector(".search-input");
  city.value = "";
}

function getCity() {
  let city = document.querySelector(".search-input").value;
  if (city && city.trim()) {
    city = city.toLowerCase().trim();
    clearCityValue();
    return city;
  }
}

function showWeather(event) {
  event.preventDefault();
  let city = getCity();
  if (city) {
    getWeatherData(city);
  }
}

let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", showWeather);

//get weather data
function displayElement(selector, value) {
  let element = document.querySelector(selector);
  return (element.innerHTML = value);
}

function setIcon(selector, { icon, text }) {
  let element = document.querySelector(selector);
  element.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  element.setAttribute("alt", text);
}

function renderWeather(response) {
  let { humidity, temp } = response.data.main;
  let { speed } = response.data.wind;
  let city = response.data.name;
  let date = formatDate(response.data.dt);

  let description = {};
  description.text = response.data.weather[0].description;
  description.icon = response.data.weather[0].icon;

  displayElement(".city", city);
  displayElement(".date", date);
  displayElement(".weather-desc", description.text);

  setIcon(".day-icon", description);
  displayElement(".humidity", humidity);
  displayElement("#temperature", Math.round(temp));
  displayElement(".wind", speed);

  getForecast(response.data.coord);
}

function getWeatherData(data) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
  let apiKey = "16854fb55399cdd51737d3f388b62c57";
  let units = "metric";
  let requestUrl;

  if (typeof data === "string") {
    requestUrl = `${apiUrl}q=${data}&units=${units}&appid=${apiKey}`;
  } else if (typeof data === "object") {
    let { latitude, longitude } = data.coords;
    requestUrl = `${apiUrl}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  }
  axios.get(requestUrl).then(renderWeather);
}

// weather in current location
function showCurentLocationWeather(event) {
  navigator.geolocation.getCurrentPosition(getWeatherData);
}

let locationBtn = document.querySelector(".current-btn");
locationBtn.addEventListener("click", showCurentLocationWeather);

//default city
getWeatherData("Kyiv");

//get forecast
function getForecast({ lon, lat }) {
  let apiKey = "16854fb55399cdd51737d3f388b62c57";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showForecast);
}

function setForecasrDay(str, forecastDay) {
  let iconUrl = `http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`;
  let template = `<li class="forecast-item card">
    <div class="item-info">
      <p class="day">${formatDay(forecastDay.dt)}</p>
      <p class="dayly-temperature">${Math.round(
        forecastDay.temp.min
      )}°/${Math.round(forecastDay.temp.max)}°</p>
    </div>
      <img class="daily-icon" src=${iconUrl} alt=${
    forecastDay.weather.description
  } />
  </li>`;
  return str + template;
}

function showForecast(response) {
  let forecastDayly = response.data.daily.filter((item, index) => index < 5);
  let forecastHourly = response.data.hourly.filter(
    (item, index) => index % 2 === 0 && index < 10
  );

  let container = document.querySelector(".forecast");
  container.innerHTML = forecastDayly.reduce(setForecasrDay, "");

  let hourly = document.querySelector(".hourly-list");
  hourly.innerHTML = forecastHourly.reduce(setForecasrHourly, "");
}

//hourly forecast
function setForecasrHourly(str, forecastHour) {
  let iconUrl = `http://openweathermap.org/img/wn/${forecastHour.weather[0].icon}@2x.png`;
  let template = `<li class="hourly-list-item card">
    <p class="time">${new Date(forecastHour.dt * 1000).getHours()}:00</p>
    <img class="daily-icon" src=${iconUrl} alt=${
    forecastHour.weather.description
  } />
    <p class="temperature">${Math.round(forecastHour.temp)}°</p>
    </li>`;
  return str + template;
}
