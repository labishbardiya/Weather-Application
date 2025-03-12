# Weather App

A modern, responsive weather application that provides current weather conditions and 5-day forecasts for any city. Built with JavaScript, HTML, and CSS.

## Features

- **Real-time Weather Data**
  - Current temperature and conditions
  - Humidity and wind speed
  - 5-day weather forecast
  - Weather-based background images

- **User Interface**
  - Clean and responsive design
  - Dark/Light mode toggle
  - Temperature unit toggle (Celsius/Fahrenheit)
  - Location-based weather detection
  - Search by city name

- **Additional Features**
  - Dynamic weather icons
  - Error handling for invalid cities
  - Loading animations
  - Persistent dark mode preference

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [OpenWeather API](https://openweathermap.org/api)
- Font Awesome Icons

## Setup and Installation

1. Clone the repository:

2. Navigate to the project directory:

3. Create an `images` folder and add the following weather background images:
- clear-day.png
- clear-night.png
- cloudy.png
- rainy.png
- thunderstorm.png
- snow.png
- mist.png

4. Open `index.html` in your browser or use a local server:

## API Configuration

The app uses the OpenWeather API. The API key is already included in the code, but for your own deployment, you should:

1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Get your API key
3. Replace the API key in `script.js`:

## Usage

1. **Search for a City**
   - Type a city name in the search box
   - Press Enter or click the search icon

2. **Use Current Location**
   - Click the location icon to get weather for your current location
   - Allow location access when prompted

3. **Toggle Temperature Unit**
   - Click the "Switch to °F/°C" button to change temperature units

4. **Dark Mode**
   - Click the sun/moon icon in the top-right corner to toggle dark mode

## Features in Detail

### Current Weather
- City name and country
- Current temperature
- Weather description
- Humidity percentage
- Wind speed
- Weather condition icon

### 5-Day Forecast
- Date and day of the week
- Weather icon
- Maximum and minimum temperatures
- Weather description
- Humidity and wind speed

### Dynamic Backgrounds
The background image changes based on weather conditions:
- Clear sky
- Cloudy
- Rainy
- Thunderstorm
- Snow
- Mist

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

