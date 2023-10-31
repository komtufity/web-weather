const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById("current-temp");

const API_KEY = '7f87fea8754da8a7e323e71f9751623b';

getWeatherFirstTime();

function getWeatherFirstTime(){
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=40&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
        console.log(data);
        showWeatherData(data);
        })
    })
}

function getLatLon(){
    const city = document.getElementById('city').value;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data);
        if (Object.keys(data).length == 0) alert(`There's no City named ${city}, check the spelling of the city`)
        else getWeatherData(data);
    })
}

function getWeatherData(data){
    let {lat, lon} = data[0];

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {
    console.log(data);
    showWeatherData(data);
    })
}

function showWeatherData(data){
    const timeNow = new Date();
    const time = new Date(timeNow.getTime() + (data.city.timezone - 25200) * 1000);
    const month = time.getMonth();
    const monthString = time.toLocaleString('en-US', { month: "short" });
    const date = time.getDate();        
    const day = time.getDay();
    const dayString = time.toLocaleString('en-US', { weekday: "long" });
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const hoursleadingzero = (hoursIn12HrFormat.toString()).padStart(2, "0");
    const minutes = time.getMinutes();
    const minutesleadingzero = (minutes.toString()).padStart(2, "0");
    const ampm = hour >= 12 ? 'PM' : 'AM'
    let {humidity, pressure} = data.list[0].main;
    const sunrise = new Date((data.city.sunrise + data.city.timezone - 25200) * 1000);
    const sunset = new Date((data.city.sunset + data.city.timezone - 25200) * 1000);
    let {speed} = data.list[0].wind;

    timeEl.innerHTML = `${hoursleadingzero}:${minutesleadingzero} <span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = `${dayString}, ` + `${date} ` + `${monthString}`; 
    timezone.innerHTML = `${data.city.name}`;
    countryEl.innerHTML = `${data.city.country}`

    currentWeatherItemEl.innerHTML =
    `<div class="weather-items">
        <p>Humidity</p>
        <p>${humidity}%</p>
    </div>    
    <div class="weather-items">
        <p>Pressure</p>
        <p>${pressure}</p>
    </div> 
    <div class="weather-items">
        <p>Wind Speed</p>
        <p>${speed}</p>
    </div>
    <div class="weather-items">
        <p>Sunrise</p>
        <p>${window.moment(sunrise).format("hh:mm a")}</p>
    </div>
    <div class="weather-items">
        <p>Sunset</p>
        <p>${window.moment(sunset).format("hh:mm a")}</p>
    </div>`

    let otherDayForecast = ''
    data.list.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <image src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"></image>
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="weather">${day.weather[0].main}</div>
                <div class="temp">${day.main.temp}&#176; C</div>
            </div>
            `
        }else if (idx % 8 == 0){
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <image src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"></image>
                <div class="weather">${day.weather[0].main}</div>
                <div class="temp">${day.main.temp}&#176; C</div>
            </div> 
            
            `
        }

        weatherForecastEl.innerHTML = otherDayForecast;
    })


}

var input = document.getElementById('city');
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("button-input").click();
    }
});