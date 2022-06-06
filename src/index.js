//display the current date and time
function showDate() {
  let dateNow = new Date();
  let date = document.querySelector(".date");
  let time = document.querySelector(".time");

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Novovember",
    "December",
  ];

  let dateObj = {
    currentDate: dateNow.getDate(),
    currentMonth: months[dateNow.getMonth()],
    currentHours:
      dateNow.getHours() >= 10 ? dateNow.getHours() : `0${dateNow.getHours()}`,
    currentMinutes:
      dateNow.getMinutes() >= 10
        ? dateNow.getMinutes()
        : `0${dateNow.getMinutes()}`,
  };

  date.innerHTML = `${dateObj.currentDate}, ${dateObj.currentMonth}`;
  time.innerHTML = `${dateObj.currentHours}:${dateObj.currentMinutes}`;
}

showDate();

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

  renderElement(".city", city);
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
