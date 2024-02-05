var map = null; 
var marker = null;  

let lastCity = null;
var cityStorageFlag = false;
const apiKeyVisualCrossing = "FQ52NM2JK4JXEQZVGZJ3PS3HW"

var tempC = 0;
var temp2 = 0;
var tempF = 0;
var feels = 0;
var feelsC = 0;
var feelsF = 0;


var mainTemps = [];
var tempsC = [];
var tempsF = [];




function setLocalStorage(value){
    if (!cityStorageFlag){
        localStorage.setItem("city", value);
    }
}

function getLastCity(){
    return localStorage.getItem("city");
}

function setPlaceholderToLastCity(){
    var cityInput = document.getElementById("city");
    if (getLastCity() != null){
        cityInput.value = getLastCity();
    }
}

function chooseTemp(){
    toggle.checked? toFahrenheit():toCelsius();
}
function toFahrenheit(){
    tempF = (tempC / (5/9)) - 32;
    return tempF;
}
function toCelsius(){
    tempC = (tempF - 32) * (5/9);
    return tempC;
}
function toFahrenheitFeels(){
    feelsF = (feelsC / (5/9)) - 32;
    return feelsF;
}
function toCelsiusFeels(){
    feelsC = (feelsF - 32) * (5/9);
    return feelsC;
}

function secondaryToCelsius(value){
    let tempCsecond = (value - 32) * (5/9);
    return tempCsecond
}

function toFahrenheitSecondaryFrames(){     
    for (let index = 0; index < 5; index++) {
        tempsF.push(toFahrenheit(tempsC[index]));  
    }  
}

function toCelsiusSecondaryFrames(){
    for (let index = 0; index < 5; index++) {
        tempsC.push(secondaryToCelsius(tempsF[index]));
    } 
}

function settingFehrenheitSecondaryFrames(){
    for (let index = 1; index <= 5; index++) {
        tempsF.push(mainTemps[index]);
    }
}

function loadLastWeatherPage(){
    setPlaceholderToLastCity();
    getLastCityWeather(getLastCity());
}


// use local storage
window.onload = loadLastWeatherPage();



function handelEmptyError(value){
    // handel empty request
    const error = document.getElementById("error-content");
    const cityInput = document.getElementById("city");
    if (!value) {
        error.innerHTML = "You have to chose a city!";
        cityInput.classList.add("error-input");
        cityStorageFlag = true;
        clearContent();
        return;
    }else{
        error.innerHTML = "";
        cityInput.classList.remove("error-input");
        cityStorageFlag = false;
        showContent();
    }
}

function handelWrongCityError(value){
    const error = document.getElementById("error-content");
    const cityInput = document.getElementById("city");
    if(value === 400){
        error.innerHTML = "The city you chose does not exist!";
        cityInput.classList.add("error-input");
        cityStorageFlag = true;
        clearContent();
        return;
    }else{
        error.innerHTML = "";
        cityInput.classList.remove("error-input");
        cityStorageFlag = false;
        showContent();
    }
}

function viewAlerts(value){
    const newAlert = value;
    var alerts = document.getElementById("alertsAdisory");
    alerts.innerHTML = "";
    if(newAlert!= null){    
        alerts.innerHTML += "<p>" + newAlert.event + "</p>";
        alerts.innerHTML += "<p>" + newAlert.headline + "</p>";
    }else{
        alerts.innerHTML += "<p> There are no alerts, enjoy your day! </p>";
    }
}

async function viewMap(lat, lon){
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { Map } = await google.maps.importLibrary("maps");
    if (map === null){
        map = new Map(document.getElementById("map"), {
            zoom: 4,
            center: { lat: lat, lng: lon },
            mapId: "Map",
        });
        marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: lat, lng: lon },
        });
    }else{
        map = new Map(document.getElementById("map"), {
            zoom: 4,
            center: { lat: lat, lng: lon },
            mapId: "Map",
        });
        marker.setMap(null);
        marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: lat, lng: lon },
        });
    }
}

function invokeToggle(){
    // toggle 
    var HideToggle = document.getElementById("toggle-temp");
    HideToggle.classList.remove("hide-toggle");
    HideToggle.classList.add("toggle");
    

    var toggle = document.getElementById("toggle");



    toggle.addEventListener('change', function(){
        let temp = 0;
        let feelsLike = 0;
        if (toggle.checked){
            temp = tempC;
            feelsLike = feelsC;
        }else{
            temp = tempF;
            feelsLike = feelsF;
        }

        //toggle.checked? temp = toCelsius(): temp = toFahrenheit();
        let newTemp = document.getElementById("change-temp");
        let newFeels = document.getElementById("change-feels");
        
        newTemp.innerHTML = "Temperature: " + temp.toFixed(2);
        newFeels.innerHTML = " Feels Like: " + feelsLike.toFixed(2);
        
        for (let index = 1; index <= 5; index++) {

            if (toggle.checked){
                mainTemps[index] = tempsC[index-1];
            }else{
                mainTemps[index] = tempsF[index-1];
            }

            var test = ("change-temp-second"+index).toString();
            var secondaryTemps = document.getElementById(test);
            secondaryTemps.innerHTML = mainTemps[index].toFixed(2);  

        }

    })

}

function buildMainFrame(htmlDiv, value, mainTemp, feelsTemp){
    htmlDiv.innerHTML = "";
    htmlDiv.innerHTML += "<h3> Date: " + value.datetime + "</h3>"
    htmlDiv.innerHTML += "<br><h2 class = \"weather-details\"> Weather Description: " + value.description + "</h2></br>"
    htmlDiv.innerHTML += "<br><h2 class = \"weather-icon\"> Weather Description: " + value.icon + "</h2></br>"
    htmlDiv.innerHTML += "<h3 id = \"change-temp\"> Temperature: " + mainTemp + "</h3>"
    htmlDiv.innerHTML += "<h3 id = \"change-feels\"> Feels Like: " + feelsTemp + "</h3>"
    htmlDiv.innerHTML += "<h3> Humidity: " + value.humidity + "</h3>"
    htmlDiv.innerHTML += "<h3> Pressure: " + value.pressure + "</h3>"
}

// change the name of weatherImage to secondaryWeatherFrame
function buildSecondaryFrame(htmlDiv, value, mainTemp, index){
    htmlDiv.innerHTML += "<div class=\"forecast-background\" id=\"weatherImage"+index+"\">";
    var secondaryFrame = document.getElementById("weatherImage"+index);
    // secondaryFrame.innerHTML += "<tr>"
    secondaryFrame.innerHTML += value.datetime;
    secondaryFrame.innerHTML += "<br>" + value.conditions + "</br>"
    secondaryFrame.innerHTML += "<span id = \"change-temp-second"+index+"\">" + mainTemp + "</span>"        
}


// handle when city input is valid then invalid 
function clearContent(){
    var weatherResultContent = document.getElementById("content");
    weatherResultContent.style.display = "none";
}
function showContent(){
    var weatherResultContent = document.getElementById("content");
    weatherResultContent.style.display = "";
}
    
function setImages(value, index){
    if((value.icon.includes("cloudy"))) {
    var images = document.getElementById("weatherImage"+index.toString());
    images.classList.add("cloudy");
    }else if (value.icon.includes("snow")){
        var images = document.getElementById("weatherImage"+index.toString());
        images.classList.add("snow");
    }else if (value.icon.includes("rain")){
        var images = document.getElementById("weatherImage"+index.toString());
        images.classList.add("rain");
    }else if (value.icon.includes("Overcast")){
        var images = document.getElementById("weatherImage"+index.toString());
        images.classList.add("overcast");
    }
    else{
        var images = document.getElementById("weatherImage"+index.toString());
        images.classList.add("clear");
    }
}

function buildWeatherFrame(htmlDiv, value, tempArray){
    for (let index = 0; index <= 5; index++) {
        let tempBlockedIndex = value[index].temp;
        let feelsLikeBlockedIndex = value[index].feelslike;
        tempArray.push(tempBlockedIndex);        
        if(index<1){        
            buildMainFrame(htmlDiv, value[index], tempBlockedIndex, feelsLikeBlockedIndex);
            temp2 = value[index].temp;
            feels = value[index].feelslike;
            feelsF = feels;
            tempF = temp2;
            feelsC = toCelsiusFeels();
            tempC = toCelsius();
        }else{           
            buildSecondaryFrame(forecast, value[index], tempBlockedIndex, index);      
        }
        setImages(value[index], index);
    }
}

function settingSecondaryFramesTemps(){
    settingFehrenheitSecondaryFrames();
    toCelsiusSecondaryFrames();    
}

async function getData() {
    try {
        let [city, resultData, forecast] = getDivs();        
        
        // handel empty request
        handelEmptyError(city);

        const urlVisualCrossing = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?key=" + apiKeyVisualCrossing;
        const responseVisualCrossing = await fetch(urlVisualCrossing)

        // handel requet of a wrong city
        handelWrongCityError(responseVisualCrossing.status);

        const dataVisualCrossing = await responseVisualCrossing.json(); 
        
        // local storage setting
        setLocalStorage(city);

        showData(forecast, resultData, mainTemps, dataVisualCrossing);

    } catch (error) {
        console.error(error);
    }
}

function getDivs(){
    var city = document.getElementById("city").value.toLowerCase();
    var resultData = document.getElementById("result");  
    var forecast = document.getElementById("forecast");

    return [city, resultData, forecast];
}

function showData(forecastDiv, resultDiv, tempArray, weatherData){
    
    // invoke toggle 
    invokeToggle();
    
    forecastDiv.innerHTML = "";

    buildWeatherFrame(resultDiv, weatherData.days, tempArray)

    settingSecondaryFramesTemps();

    // alerts
    viewAlerts(weatherData.alerts[0]);

    // invoke a map from leaflet website
    viewMap(weatherData.latitude,weatherData.longitude);
}


async function getLastCityWeather(Lastcity){  
    let [city, resultData, forecast] = getDivs();        
        
    const urlVisualCrossing = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + Lastcity + "?key=" + apiKeyVisualCrossing;
    const responseVisualCrossing = await fetch(urlVisualCrossing)

    const dataVisualCrossing = await responseVisualCrossing.json(); 
    
    // local storage setting
    setLocalStorage(city);

    showData(forecast, resultData, mainTemps, dataVisualCrossing);
}