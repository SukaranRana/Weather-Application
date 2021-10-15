"use strict";
const input = document.querySelector(".input");
const searchBtn = document.querySelector(".inputSearch");
const gpsBtn = document.querySelector(".gps");

const errorFunction = function () {
  alert("Error");
};

//Reverse Geocoding
const coordsToLocation = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then((response) => response.json())
    .then((data) => {
      fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=bcc1c90b3a0844779e155504211210&q=${data.city}, ${data.state}&days=7&aqi=yes&alerts=yes`
      )
        .then((response) => response.json())
        .then((data) => {
          displayUI(data);
          console.log(data);
        });
    });
};

//Common function to display UI
const displayUI = function (data) {
  const { location } = data;
  const { current } = data;
  const { forecast } = data;

  //Fetching Date
  const now = new Date();
  document.querySelector(".day").textContent = new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "long",
    }
  ).format(now);
  const month = new Intl.DateTimeFormat("en-GB", {
    month: "short",
  }).format(now);
  document.querySelector(
    ".date"
  ).textContent = `${now.getDate()} ${month}, ${now.getFullYear()}`;

  //Fetching place
  document.querySelector(
    ".place"
  ).textContent = `${location.name}, ${location.country}`;
  //Adding image
  document.querySelector(
    ".icon"
  ).outerHTML = `<img class="img-fluid icon" src="${current.condition.icon}" alt="Weather Image"/>`;
  //Fetching temp
  document.querySelector(".temp").textContent = current.temp_c.toFixed(0);
  document.querySelector(".type").textContent = current.condition.text;

  //Fetching table contents
  document.querySelector(".prec").textContent = `${current.precip_mm}mm`;
  document.querySelector(".humidity").textContent = `${current.humidity}%`;
  document.querySelector(".wind").textContent = `${current.wind_kph}kph`;
  //prettier-ignore
  document.querySelector(".aqi").textContent = `${current.air_quality.pm2_5.toFixed(1)}`;

  //Fetching forecast details
  for (let i = 0; i < 3; i++) {
    //Days
    const d = new Date(0);
    d.setUTCSeconds(forecast.forecastday[i].date_epoch);
    document.querySelector(`.forecast-day-${i + 1}`).textContent = String(
      d
    ).slice(0, 3);
    //Temp
    document.querySelector(`.temp${i + 1}`).textContent =
      forecast.forecastday[i].day.avgtemp_c.toFixed(0);
    //Icons
    document.querySelector(
      `.forecast_icon-${i + 1}`
    ).outerHTML = `<img class="img-fluid icon forecast_icon-${i + 1}" src="${
      forecast.forecastday[i].day.condition.icon
    }" alt="Weather Image"/>`;
  }
};

//Event listeners
gpsBtn.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      coordsToLocation(latitude, longitude);
    }, errorFunction);
  }
});

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (input.value === "") return;
  const location = input.value;
  input.value = "";
  fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=bcc1c90b3a0844779e155504211210&q=${location}&days=7&aqi=yes&alerts=yes`
  )
    .then((response) => response.json())
    .then((data) => {
      displayUI(data);
    });
});

const init = function () {
  fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=bcc1c90b3a0844779e155504211210&q=delhi&days=7&aqi=yes&alerts=yes`
        )
          .then((response) => response.json())
          .then((data) => {
            displayUI(data);
          });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        coordsToLocation(latitude, longitude);
      },
      function () {
        fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=bcc1c90b3a0844779e155504211210&q=delhi&days=7&aqi=yes&alerts=yes`
        )
          .then((response) => response.json())
          .then((data) => {
            displayUI(data);
          });
      }
    );
  }
};
init();
//Sunrise+sunset
// fetch(
//   "http://api.weatherapi.com/v1/astronomy.json?key=bcc1c90b3a0844779e155504211210&q=delhi&dt=2021-10-12"
// )
//   .then((response) => response.json())
//   .then((data) => console.log(data));
//for icons
// https://www.weatherapi.com/docs/weather_conditions.json

//Splash screen
const splash = document.querySelector(".splash");
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => splash.classList.add("display-none"), 2000);
});
