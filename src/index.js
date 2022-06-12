//format current date and time
function formatDate(timestamp) {
  let currentDate = new Date(timestamp * 1000);

  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = {
    day: weekdays[currentDate.getDay()],
    hours:
      currentDate.getHours() > 10
        ? currentDate.getHours()
        : `0${currentDate.getHours()}`,
    minutes:
      currentDate.getMinutes() > 10
        ? currentDate.getMinutes()
        : `0${currentDate.getMinutes()}`,
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
function renderElement(selector, value) {
  let element = document.querySelector(selector);
  return (element.innerHTML = value);
}

function renderWeather(response) {
  let { humidity, temp, temp_max, temp_min } = response.data.main;
  let { speed } = response.data.wind;
  let city = response.data.name;
  let date = formatDate(response.data.dt);

  renderElement(".city", city);
  renderElement(".date", date);
  renderElement(".humidity", humidity);
  renderElement("#temperature", Math.round(temp));
  renderElement(".min", Math.round(temp_min));
  renderElement(".max", Math.round(temp_max));
  renderElement(".wind", speed);
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
