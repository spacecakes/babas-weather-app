let currentLocation;

// Get geolocation
document.getElementById('find-me').addEventListener('click', getLocation);
function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        document.querySelector('#coordinates').textContent = `
        Latitude ${position.coords.latitude}°,
        Longitude ${position.coords.longitude}`;
        currentLocation = position.coords.latitude + ',' + position.coords.longitude;
        getForecast(currentLocation);
    });
}

function getDay() {
    const day = new Date();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[day.getDay()];
}

function getForecast(city = 'stockholm') {
    fetch(`https://api.apixu.com/v1/forecast.json?key=718bc1aabbf147fca6782545181403&q=${city}&days=7`)
        .then(response => response.json()) // Parse response to JSON
        .then(json => {
            let counter = 1;

            // Add city and timestamp to elements
            document.querySelector('#city').textContent = `Weather forecast for ${json.location.name}, ${json.location.country} on ${getDay()}`;
            document.querySelector('#updated').textContent = `Last updated on ${getDay()} ${json.current.last_updated}`;

            // Add specific current weather data
            document.querySelector(`#day-${counter} .feels-like`).textContent = `Feels like ${Math.round(json.current.feelslike_c)} °C`;
            document.querySelector(`#day-${counter} .pressure`).textContent = `Pressure ${Math.round((json.current.pressure_mb) / 1000).toFixed(2)} bar`;

            // Add weather data to elements
            json.forecast.forecastday.forEach(forecastday => {
                document.querySelector(`#day-${counter} .icon`)
                    .setAttribute('src', `https:${forecastday.day.condition.icon}`);
                document.querySelector(`#day-${counter} .date`).textContent = forecastday.date;
                document.querySelector(`#day-${counter} .temp`).textContent = Math.round(forecastday.day.avgtemp_c) + ' °C';
                document.querySelector(`#day-${counter} .conditions`).textContent = forecastday.day.condition.text;
                document.querySelector(`#day-${counter} .diff-temp`).textContent = `Temps ${Math.round(forecastday.day.mintemp_c)} to ${Math.round(forecastday.day.maxtemp_c)} °C`;
                document.querySelector(`#day-${counter} .humidity`).textContent = `Humidity ${forecastday.day.avghumidity}%`;
                document.querySelector(`#day-${counter} .rain`).textContent = `Precipitation ${forecastday.day.totalprecip_mm} mm`;
                document.querySelector(`#day-${counter} .max-wind`).textContent = `Wind ${(forecastday.day.maxwind_kph / 3.6).toFixed(2)} m/s`;
                document.querySelector(`#day-${counter} .sunrise`).textContent = forecastday.astro.sunrise;
                document.querySelector(`#day-${counter} .sunset`).textContent = forecastday.astro.sunset;
                counter++;
            });
            document.getElementById('city-input').value = json.location.name;
        }).catch(err => {
            document.getElementById('city-input').value = 'Try again';
            console.log('error:', err.message);
        });
}

// Search city functionality
document.getElementById('find-city').addEventListener('submit', addPost);
function addPost(e) {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    getForecast(city);
}

// Populate website on load
getForecast();
getLocation();