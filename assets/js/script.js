//Connect to weather API

//Create function that takes data from button or from search box 
//city name is converted to longitude and latitude via geocoding-api

//When a button is pressed previous data is cleared from the window
    //Saves weather data in local storage
    
    //Pull in weather data from api
    //populate main block with current weather using DOM manipulation
    //populate support blocks with using DOM manipulation 
var citySearchEl = $('.city-input');
var searchButtonEl = $('.search-btn');
var citySearchButtonsEl = $('#city-search');
var coordinates;
var APIkey = '96ac8996fd4a68c32fcb968cde0d63d8'  
var currentDay = dayjs();
var cityNameEl = $('#city-name');
var currentTempEl = $('#current-temp');
var currentHumdiditiyEl = $('#current-humidity')
var currentWindEl = $('#current-wind')
console.log(currentDay); 
//convert city to lon and latitude
//need to pull cityName from button data or search
//var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid="+APIkey;

var storedCity = localStorage.getItem('cityName');
if(storedCity){
convertLonLat(storedCity);
}
else{
  storedCity = 'Atlanta';
  convertLonLat(storedCity);
}

function convertLonLat(cityName){
    var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid="+APIkey;
    fetch(geocodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
       coordinates = [data[0].lon,data[0].lat];
       getForecast(coordinates);
       getWeather(coordinates);
       
       //console.log(coordinates);
      //  console.log(coordinates)
      //  return coordinates

    }) 
  }


function handleSearchButton(event){
    event.preventDefault();
    localStorage.clear();
    //If search button is selected pull city name from input box
    //Else pull from button data
    if($(this)  == searchButtonEl){
       var cityName = citySearchEl.val().trim(); 
       console.log(cityName);
       localStorage.setItem('cityName',cityName);
    }
    else{
      console.log(this);
       var cityName =  $(this).attr('data-place'); 
       console.log(cityName);
       localStorage.setItem('cityName',cityName);
    }
  convertLonLat(cityName);
}


function getForecast(coordinates){

    console.log(coordinates);
    var lon = coordinates[0];
    var lat = coordinates[1];

    var weeklyWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid='+APIkey;
    
    fetch(weeklyWeatherURL)
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
      console.log('This is future forecast data')
      console.log('-------------')
      data = data.list;
      console.log(data)  
      var futureForecast = [data[3],data[11],data[19],data[27],data[35]];
      console.log(futureForecast);
      for(var i=0 ; i<futureForecast.length ; i++){

        var weatherBlock = $('[data-index='+i+']')[0];
        weatherBlock.textContent = '';
        var blockDate = document.createElement('h5');
        var line = document.createElement('hr')
        var blockIcon = document.createElement('i');
        var blockTemp = document.createElement('p');
        var blockWind = document.createElement('p');
        var blockHumidity = document.createElement('p');

        var date = dayjs.unix(futureForecast[i].dt).format('MM/DD/YYYY');
        var weatherType = futureForecast[i].weather[0].main;

        if(weatherType == 'Rain'){
          blockIcon.addClass = "fa-solid fa-cloud-showers"
        }
        else if(weatherType == 'Clouds'){
          blockIcon.textContent = 'Clouds'
        }
        else if(weatherType == 'Clear'){
          blockIcon.textContent = 'Sunny'
        }

        console.log(weatherType);
       
        blockDate.textContent = date;

        var forecastTemp = 'Temp: '+(((futureForecast[i].main.temp - 273.13)*(9/5)+ 32).toFixed(1)) + ' ' + String.fromCharCode(176) + 'F';
        
        blockTemp.textContent = forecastTemp;
        blockWind.textContent = 'Wind: ' + futureForecast[i].wind.speed + ' MPH';
        blockHumidity.textContent= 'Humidity: ' + futureForecast[i].main.humidity + ' %';
     
        
        weatherBlock.append(blockDate);
        weatherBlock.append(line);
        weatherBlock.append(blockIcon);
        weatherBlock.append(blockTemp);
        weatherBlock.append(blockWind);
        weatherBlock.append(blockHumidity);


        
      }
    })
  }

  function getWeather(coordinates){

    console.log(coordinates);
    var lon = coordinates[0];
    var lat = coordinates[1];
    
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+APIkey;

    fetch(currentWeatherURL)
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
      console.log('This is current weather data')
      console.log('-------------')
      console.log(data)  
      var cityName = data.name;
      var currentTemp = ((data.main.temp - 273.13)*(9/5) + 32).toFixed(1) ;
      var currentHumidity = data.main.humidity;
      var currentWind = data.wind.speed;
      var currentDate = dayjs().format('(DD/MM/YYYY)');
      console.log(currentDate);
      console.log(currentTemp, currentHumidity, currentWind, cityName);

      cityNameEl.text(cityName + ' ' + currentDate);
      currentTempEl.text(currentTemp + ' ' + String.fromCharCode(176) + 'F');
      currentHumdiditiyEl.text(currentHumidity + ' %');
      currentWindEl.text(currentWind + ' MPH');

      // var currentWeather = {cityName: cityName,
      //    currentTemp: currentTemp,
      //     currentHumidity: currentHumidity,
      //      currentWind: currentWind, 
      //      currentDate: currentDate};

      // localStorage.setItem('currentWeather',currentWeather)
      
    })
  }

//function populateWeatherData(){}
// searchButtonEl.on('click',getWeather);
citySearchButtonsEl.on('click','.btn-primary',handleSearchButton);


