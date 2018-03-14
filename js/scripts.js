
function getDay() {
    const day = new Date();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[day.getDay()];
}

function getForecast(city) {
    fetch(`https://api.apixu.com/v1/forecast.json?key=718bc1aabbf147fca6782545181403&q=${city}&days=7`)
        .then(response => response.json()) // Parse response to JSON
        .then(json => {
            let counter = 1;

            // Add city and timestamp to elements
            document.querySelector('#city').textContent = `Weather forecast for ${json.location.name}, ${json.location.country} on ${getDay()}`;
            document.querySelector('#updated').textContent = `Last updated on ${getDay()} ${json.current.last_updated}`;

            json.forecast.forecastday.forEach(forecastday => {
                // Add weather data to elements
                document.querySelector(`#day-${counter} .icon`).setAttribute('src', `https:${forecastday.day.condition.icon}`);
                document.querySelector(`#day-${counter} .date`).textContent = forecastday.date;
                document.querySelector(`#day-${counter} .temp`).textContent = Math.round(forecastday.day.avgtemp_c) + ' °C';
                document.querySelector(`#day-${counter} .diff-temp`).textContent = `Temps between ${Math.round(forecastday.day.mintemp_c)} and ${Math.round(forecastday.day.maxtemp_c)} °C`;
                document.querySelector(`#day-${counter} .conditions`).textContent = forecastday.day.condition.text;
                document.querySelector(`#day-${counter} .humidity`).textContent = `Humidity at ${forecastday.day.avghumidity}%`;
                document.querySelector(`#day-${counter} .rain`).textContent = `${forecastday.day.totalprecip_mm} mm rain`;
                document.querySelector(`#day-${counter} .max-wind`).textContent = `Windspeeds of ${(forecastday.day.maxwind_kph / 3.6).toFixed(2)} m/s`;
                document.querySelector(`#day-${counter} .sunrise`).textContent = forecastday.astro.sunrise;
                document.querySelector(`#day-${counter} .sunset`).textContent = forecastday.astro.sunset;
                counter++;
            });
        });
}


getForecast('stockholm');

