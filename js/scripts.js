let currentLocation;

// Get geolocation
document.getElementById('find-me').addEventListener('click', getLocation);

function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        document.querySelector('#coordinates').textContent = `
        Latitude ${position.coords.latitude}°,
        longitude ${position.coords.longitude}°`;
        currentLocation = position.coords.latitude + ',' + position.coords.longitude;
        getForecast(currentLocation);
    });
}

// Get date and convert to days
function getDay(offset = 0) {
    const day = new Date();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[(day.getDay() + offset) % 7];
}

// Fetch forecast data from API 
function getForecast(city = 'stockholm') {
    fetch(`https://api.apixu.com/v1/forecast.json?key=718bc1aabbf147fca6782545181403&q=${city}&days=7`)
        .then(response => response.json()) // Parse response to JSON
        .then(json => renderForecast(json)).catch(err => renderErrors(err));
}

// Render error message if fetch is unsuccessful
function renderErrors(err) {
    {
        document.getElementById('city-input').placeholder = 'Spell properly';
        document.getElementById('city-input').value = '';
        document.querySelector('#city').textContent = 'Y U NO forecast?';
        console.log('Error: ', err.message);
    }
}

// Write API data to DOM
function renderForecast(data = 'Stockholm') {
    // Add city and timestamp to elements
    document.querySelector('#city')
        .textContent = `Weather forecast for ${data.location.name}, ${data.location.country} on ${getDay()}`;
    document.querySelector('#updated')
        .textContent = `Last updated on ${getDay()} ${data.current.last_updated}`;

    // Add specific current weather data
    document.querySelector(`#day-1 .feels-like`)
        .textContent = `Feels like ${Math.round(data.current.feelslike_c)} °C`;
    document.querySelector(`#day-1 .pressure`)
        .textContent = `Pres. ${(data.current.pressure_mb / 1000).toFixed(3)} bar`;

    // Add weather data to elements
    let counter = 1;
    data.forecast.forecastday.forEach(forecastday => {
        if (counter === 2)
            document.querySelector(`#day-${counter} .day`).textContent = 'Tomorrow';
        else
            document.querySelector(`#day-${counter} .day`).textContent = getDay(counter - 1);

        document.querySelector(`#day-${counter} .icon`)
            .setAttribute('src', `https:${forecastday.day.condition.icon}`);
        document.querySelector(`#day-${counter} .temp`)
            .textContent = Math.round(forecastday.day.avgtemp_c) + ' °C';
        document.querySelector(`#day-${counter} .conditions`)
            .textContent = forecastday.day.condition.text;
        document.querySelector(`#day-${counter} .diff-temp`)
            .textContent = `Temps ${Math.round(forecastday.day.mintemp_c)} to ${Math.round(forecastday.day.maxtemp_c)} °C`;
        document.querySelector(`#day-${counter} .humidity`)
            .textContent = `Humidity ${forecastday.day.avghumidity}%`;
        document.querySelector(`#day-${counter} .rain`)
            .textContent = `Rain ${forecastday.day.totalprecip_mm} mm`;
        document.querySelector(`#day-${counter} .max-wind`)
            .textContent = `Wind ${(forecastday.day.maxwind_kph / 3.6).toFixed(2)} m/s`;
        document.querySelector(`#day-${counter} .sunrise`)
            .textContent = forecastday.astro.sunrise;
        document.querySelector(`#day-${counter} .sunset`)
            .textContent = forecastday.astro.sunset;
        counter++;
    });

    // Add location to search field
    document.getElementById('city-input').placeholder = data.location.name;
    document.getElementById('city-input').value = '';

    // Unhide forecast
    document.getElementById('forecast').classList.remove('hide');
    document.getElementById('day-1').classList.remove('hide');
}

// Search box functionality
document.getElementById('find-city').addEventListener('submit', searchCity);
function searchCity(e) {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    getForecast(city);
}

// Get data on load
getLocation();
getForecast();
