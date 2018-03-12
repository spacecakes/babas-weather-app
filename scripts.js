// Create elements 

function getDay() {
    const day = new Date();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[day.getDay()];
}

function getWeather() {
    fetch('https://api.apixu.com/v1/forecast.json?key=50bab9bae1bd4dca94c93510180603&q=stockholm&days=6')
        .then(response => response.json())
        .then(json => {

            // Add API data to elements
            document.querySelector('#city').textContent = `Weather forecast for ${json.location.name}, ${json.location.country} on ${getDay()}`;
            document.querySelector('#conditions').textContent = json.current.condition.text;
            document.querySelector('#icon').setAttribute('src', `https:${json.current.condition.icon}`);
            document.querySelector('#temp').textContent = Math.round(json.current.temp_c) + ' °C';
            document.querySelector('#updated').textContent = `Last updated ${json.current.last_updated}`;
        });
}


getWeather();
