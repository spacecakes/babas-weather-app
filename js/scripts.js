let currentLocation = '';
let forecast;

// Get geolocation
function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// Locate button
document.getElementById('find-me').addEventListener('click', init);

// Get date and convert to days
function getDay(offset = 0) {
    const day = new Date();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[(day.getDay() + offset) % 7];
}

async function getForecast(city) {
    try {
        const response = await fetch(`https://api.apixu.com/v1/forecast.json?key=718bc1aabbf147fca6782545181403&q=${city}&days=7`);
        if (response.ok) {
            return response.json();
        }
        else if (city === '') {
            throw new Error('Empty search');
        }
        else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        throw new Error(err);
    }
}

// Render error message if fetch is unsuccessful
function renderErrors(err) {
    const input = document.getElementById('city-input');
    const headline = document.getElementById('city');
    const value = input.value;
    const placeholder = input.placeholder;

    if (err.message === 'Error: Empty search') {
        input.placeholder = '🙄';
        setTimeout(() => (input.placeholder = 'Type in something'), 300);
        setTimeout(() => (input.placeholder = placeholder), 1000);
    }
    else {
        input.placeholder = '💩';
        setTimeout(() => (input.placeholder = 'Spell properly'), 300);
        setTimeout(() => (input.value = value), 1000);
    }
    input.value = '';
    headline.textContent = 'Y U NO forecast?';
    console.log(err.message);
}

// Write API data to DOM
function renderForecast(data) {
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

// Write location data to DOM
function renderCoordinates(location) {
    // Write location data 
    document.querySelector('#coordinates').textContent = `
        Latitude ${location.coords.latitude.toFixed(5)}°,
        longitude ${location.coords.longitude.toFixed(5)}°`;
}

// Search box functionality
document.getElementById('find-city').addEventListener('submit', findLocation);
async function findLocation(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('city-input').value;
    try {
        forecast = await getForecast(searchTerm);
        renderForecast(forecast, searchTerm);
    } catch (err) {
        renderErrors(err);
    }
}

// Run application on page load
async function init() {
    try {
        // Fetch new data
        currentLocation = await getLocation();
        const coordinates = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
        forecast = await getForecast(coordinates);

        // Render data
        renderForecast(forecast);
        renderCoordinates(currentLocation);

        // Save data
        localStorage.setItem('location', coordinates);
        localStorage.setItem('forecast', JSON.stringify(forecast));
    } catch (err) {
        renderErrors(err);
    }
}

init();