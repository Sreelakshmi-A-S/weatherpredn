const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");



const API_KEY = "bb5e2a8dd0e88d321eb5d73c48d127d2"; //api key for openweathermap api

const  createWeatherCard = (cityName, weatherItem, index) =>{
    if(index === 0) { // html for main weather card
       return `<div class="details">
       <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
       <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
       <h4>Wind :${weatherItem.wind.speed}M/S</h4>
       <h4>Humidity:${weatherItem.main.humidity}%</h4>
   </div>
   <div class="icon">
       <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
       <h4>${weatherItem.weather[0].description}</h4>
   </div>`;
    }else{ // html for main weather card

        return `<li class="card">
        <h3> (${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
    
        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind :${weatherItem.wind.speed}M/S</h4>
        <h4>Humidity:${weatherItem.main.humidity}%</h4>
    
    </li>`;
    }
}

getWeatherDetails = (cityName, lat, lon ) =>{
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
fetch(WEATHER_API_URL).then(res => res.json()).then(data =>{
//Filter the forecasts to get only one forecast per days
const uniqueForecastDay = []; 
const fiveDaysForecast =    data.list.filter(forecast =>{
const forecastDate = new Date(forecast.dt_txt).getDate();
if(!uniqueForecastDay.includes(forecastDate)){
    return uniqueForecastDay.push(forecastDate);
}
 });
//clearing previous weather data
 cityInput.value = "";
 weatherCardDiv.innerHTML = "";
 currentWeatherDiv.innerHTML = "";


//  console.log(fiveDaysForecast)
 fiveDaysForecast.forEach((weatherItem, index) =>{
   if(index === 0){
    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));

   }else{

       weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));

   }
 });
}).catch(()=>{
    alert("An error occurred while fetching the weather forecast!");
});
}


const getCityCoordinates = ()=>{
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
//get entered city coordinates (latitude ,longitude,and name) from api 
fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
//    console.log(data)
    if(!data.length) return alert(`No coordinates found for${cityName}`);
    const { name, lat, lon } = data[0];
    getWeatherDetails(name, lat, lon );
}).catch(()=>{
    alert("an error occurred while fetching the coordinates!");
});
} 

searchButton.addEventListener("click",getCityCoordinates);
