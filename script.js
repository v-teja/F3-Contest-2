window.addEventListener('beforeunload', () => {
    localStorage.clear();
});

document.addEventListener('DOMContentLoaded', () => {
    let getEl = document.getElementById('getLocation');
    let inner_map = document.getElementById('map-container');
    let pos = document.getElementById('display-positions');
    let weather = document.getElementById('weather-container');
    
    // function to get location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCurrentPosition);
        } else {
            inner_map.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    
    // function to get current location
    function getCurrentPosition(position) {
        showPosition(position);
    
        // Now setting up longitude and latitude with local storage
        let Lat = localStorage.getItem("lat");
        let Long = localStorage.getItem("long");
        console.log(Lat);
        console.log(Long);
        inner_map.innerHTML = `<div class="main-map">
           <iframe src="https://maps.google.com/maps?q=${Lat},${Long}&hl=en&z=14&amp;output=embed" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>
       </div>`
        
       
    fetch(` https://api.openweathermap.org/data/2.5/weather?lat=${Lat}&lon=${Long}&appid=bc6862b86ddb76b15cbf8fecdb893e36`)
    .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
    .then(data => {
         let temp = data.main.temp;
      let desc = data.weather[0].description;
      let speed = data.wind.speed;
      let pressure = data.main.pressure;
      let humidity = data.main.humidity;
        let timezone = data.timezone;
        let location = data.name;
        let windDir = data.wind.deg;
        let feels = data.main.feels_like;
        
      weather.innerHTML = ` <h1>Weather Data</h1><br><span>Current temperature: ${temp}K</span><span>Weather description: ${desc}</span><span>Wind Speed: ${speed} m/s</span>
      <span>Pressure: ${pressure} hPa</span><span>Humidity: ${humidity} %</span><span>Time Zone: ${timezone}</span><span>Location: ${location}</span>
      <span>Lattitude: ${Lat}</span><span>Longitude: ${Long}</span><span>Wind Direction: ${windDir} &deg</span><span>Feels Liks: ${feels}</span>`;
       })
       .catch(error => {
        console.error('Error fetching weather data:', error ? error.message : 'Unknown error');
        weather.innerHTML = 'Error fetching weather data';
      });      
    }
    
    // function to show position
    function showPosition(position) {
        localStorage.setItem("long", position.coords.longitude);
        localStorage.setItem("lat", position.coords.latitude);
        pos.innerHTML = `<span>Latitude: ${position.coords.latitude}</span> <span>Longitude: ${position.coords.longitude}</span>`;
    }
    
    getEl.addEventListener('click', () => {
        localStorage.clear();
        pos.innerHTML = '';
        inner_map.innerHTML = '';
        weather.innerHTML = '';
        getLocation();
    });

});

