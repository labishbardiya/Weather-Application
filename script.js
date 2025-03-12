const apiKey = '2540d01b62bbf2d6cbf5522205b2bd94';
const weatherBox = document.querySelector('.weather-box');
const errorBox = document.querySelector('.error');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const unitToggleBtn = document.querySelector('.unit-toggle');
const darkModeBtn = document.getElementById('darkModeBtn');
const body = document.body;
const forecastSection = document.querySelector('.forecast-section');
const forecastCards = document.querySelector('.forecast-cards');
const locationBtn = document.getElementById('locationBtn');

let isMetric = true;

const weatherBackgrounds = {
    '01': 'clear-day.png', // clear sky
    '02': 'cloudy.png', // few clouds
    '03': 'cloudy.png', // scattered clouds
    '04': 'cloudy.png', // broken clouds
    '09': 'rainy.png', // shower rain
    '10': 'rainy.png', // rain
    '11': 'thunderstorm.png', // thunderstorm
    '13': 'snow.png', // snow
    '50': 'mist.png' // mist
};

async function getWeatherData(city) {
    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${isMetric ? 'metric' : 'imperial'}`
            ),
            fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${isMetric ? 'metric' : 'imperial'}`
            )
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found');
        }

        const [weatherData, forecastData] = await Promise.all([
            weatherResponse.json(),
            forecastResponse.json()
        ]);

        displayWeather(weatherData);
        displayForecast(forecastData);

        weatherBox.classList.remove('hide');
        forecastSection.classList.remove('hide');
        errorBox.classList.add('hide');
    } catch (error) {
        weatherBox.classList.add('hide');
        forecastSection.classList.add('hide');
        errorBox.classList.remove('hide');
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isMetric ? 'metric' : 'imperial'}`
            ),
            fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isMetric ? 'metric' : 'imperial'}`
            )
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Unable to fetch weather data');
        }

        const [weatherData, forecastData] = await Promise.all([
            weatherResponse.json(),
            forecastResponse.json()
        ]);

        displayWeather(weatherData);
        displayForecast(forecastData);

        weatherBox.classList.remove('hide');
        forecastSection.classList.remove('hide');
        errorBox.classList.add('hide');
    } catch (error) {
        weatherBox.classList.add('hide');
        forecastSection.classList.add('hide');
        errorBox.classList.remove('hide');
        errorBox.querySelector('p').textContent = 'Unable to fetch weather data';
    }
}

function displayWeather(data) {
    const {
        name,
        sys: { country },
        main: { temp, humidity },
        wind: { speed },
        weather: [{ description, icon }]
    } = data;

    setWeatherBackground(icon);

    document.querySelector('.city').textContent = `${name}, ${country}`;
    document.querySelector('.temp').textContent = `${Math.round(temp)}°${isMetric ? 'C' : 'F'}`;
    document.querySelector('.description').textContent = description;
    document.querySelector('.humidity-value').textContent = `${humidity}%`;
    document.querySelector('.wind-speed').textContent = `${speed} ${isMetric ? 'km/h' : 'mph'}`;
    document.querySelector('.weather-icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function displayForecast(data) {
    forecastCards.innerHTML = '';

    // Get unique dates and their first forecast
    const dailyForecasts = data.list.reduce((acc, forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        if (!acc[date] && Object.keys(acc).length < 5) {
            acc[date] = forecast;
        }
        return acc;
    }, {});

    // Convert to array and ensure we have exactly 5 days
    const forecasts = Object.values(dailyForecasts).slice(0, 5);

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class="date">${dayName}<br>${monthDay}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather icon">
            <p class="temp-max">${Math.round(forecast.main.temp_max)}°${isMetric ? 'C' : 'F'}</p>
            <p class="temp-min">${Math.round(forecast.main.temp_min)}°${isMetric ? 'C' : 'F'}</p>
            <p class="forecast-description">${forecast.weather[0].description}</p>
        `;

        forecastCards.appendChild(card);
    });
}

function toggleUnit() {
    isMetric = !isMetric;
    unitToggleBtn.textContent = `Switch to °${isMetric ? 'F' : 'C'}`;

    // Get the current temperature and wind speed elements
    const tempElement = document.querySelector('.temp');
    const windElement = document.querySelector('.wind-speed');

    // Convert the current values without making a new API call
    if (tempElement.textContent && windElement.textContent) {
        const currentTemp = parseFloat(tempElement.textContent);
        const currentWind = parseFloat(windElement.textContent);

        if (!isNaN(currentTemp) && !isNaN(currentWind)) {
            if (isMetric) {
                // Convert F to C and mph to km/h
                const celsius = (currentTemp - 32) * (5 / 9);
                const kmh = currentWind * 1.60934;
                tempElement.textContent = `${Math.round(celsius)}°C`;
                windElement.textContent = `${Math.round(kmh)} km/h`;
            } else {
                // Convert C to F and km/h to mph
                const fahrenheit = (currentTemp * 9 / 5) + 32;
                const mph = currentWind / 1.60934;
                tempElement.textContent = `${Math.round(fahrenheit)}°F`;
                windElement.textContent = `${Math.round(mph)} mph`;
            }
        }
    }

    // Also update forecast temperatures and wind speeds
    const forecastBoxes = document.querySelectorAll('.forecast-box');
    forecastBoxes.forEach(box => {
        const maxTemp = box.querySelector('.temp-max');
        const minTemp = box.querySelector('.temp-min');
        const windSpeed = box.querySelector('.wind-speed');

        if (maxTemp && minTemp && windSpeed) {
            const maxTempValue = parseFloat(maxTemp.textContent);
            const minTempValue = parseFloat(minTemp.textContent);
            const windValue = parseFloat(windSpeed.textContent);

            if (!isNaN(maxTempValue) && !isNaN(minTempValue) && !isNaN(windValue)) {
                if (isMetric) {
                    // Convert F to C and mph to km/h
                    const maxC = (maxTempValue - 32) * (5 / 9);
                    const minC = (minTempValue - 32) * (5 / 9);
                    const kmh = windValue * 1.60934;
                    maxTemp.textContent = `${Math.round(maxC)}°C`;
                    minTemp.textContent = `${Math.round(minC)}°C`;
                    windSpeed.textContent = `${Math.round(kmh)} km/h`;
                } else {
                    // Convert C to F and km/h to mph
                    const maxF = (maxTempValue * 9 / 5) + 32;
                    const minF = (minTempValue * 9 / 5) + 32;
                    const mph = windValue / 1.60934;
                    maxTemp.textContent = `${Math.round(maxF)}°F`;
                    minTemp.textContent = `${Math.round(minF)}°F`;
                    windSpeed.textContent = `${Math.round(mph)} mph`;
                }
            }
        }
    });
}

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    darkModeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    localStorage.setItem('darkMode', isDarkMode);
}

function setWeatherBackground(iconCode) {
    const condition = iconCode.slice(0, 2);
    const backgroundImage = weatherBackgrounds[condition];
    if (backgroundImage) {
        document.body.style.backgroundImage = `url('images/${backgroundImage}')`;
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

unitToggleBtn.addEventListener('click', toggleUnit);

darkModeBtn.addEventListener('click', toggleDarkMode);

function getCurrentLocation() {
    if (navigator.geolocation) {
        // Show loading state
        locationBtn.disabled = true;
        locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
                // Reset button state
                locationBtn.disabled = false;
                locationBtn.innerHTML = '<i class="fas fa-location-dot"></i>';
            },
            // Error callback
            (error) => {
                console.error('Error getting location:', error);
                errorBox.querySelector('p').textContent = 'Unable to get your location. Please allow location access.';
                errorBox.classList.remove('hide');
                weatherBox.classList.add('hide');
                forecastSection.classList.add('hide');
                // Reset button state
                locationBtn.disabled = false;
                locationBtn.innerHTML = '<i class="fas fa-location-dot"></i>';
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        errorBox.querySelector('p').textContent = 'Geolocation is not supported by your browser';
        errorBox.classList.remove('hide');
    }
}

locationBtn.addEventListener('click', getCurrentLocation);

document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    getCurrentLocation();
});