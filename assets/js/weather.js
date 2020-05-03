
$(function() {
    // Once the page is ready, set the weather.
    updateWeather();
});

/**
 * Gets the weather from OpenWeather and then sets the class of the #weather tag based on the 
 * response.  Currently supports Clouds (Partly and Overcast), Clear, Thunderstorm, Rain
 */
function updateWeather() {
    const zip = "21286";
    const country = "us";

    const url = `https://api.openweathermap.org/data/2.5/weather`

    $.get(url, {
        zip: `${zip},${country}`,
        units: 'imperial',
        appid: 'c3fbb5439d86260a7b2548bdf17ad454'
    }, (data, status) => {
        
        $('#weather').removeClass();

        // See https://openweathermap.org/weather-conditions for possible codes.
        ///

        if (data.weather && data.weather.length > 0) {
            const weather = data.weather[0];
            if (weather.main === 'Clouds') {
                if (weather.description === 'overcast clouds') {
                    weatherClass = 'cloudy'
                } else {
                    weatherClass = 'partly-cloudy'
                }            
            }
            if (weather.main === 'Clear') {
                weatherClass = 'clear';
            }
            if (weather.main === 'Thunderstorm') {
                weatherClass = 'thunderstorm';
            }
            if (weather.main === 'Rain') {
                weatherClass = 'rain';
            }
    
            $('#weather').addClass(weatherClass);
        }
    })
}