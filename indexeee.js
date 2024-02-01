var map = null; 
var marker = null;  

let lastCity = null;

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




// we use local storage rather than cookies because local storage is related to client side
// while cookies is more related to server side

function setLocalStorage(value){
    localStorage.setItem("city", value);
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




// use local storage
window.onload = setPlaceholderToLastCity();



function handelEmptyError(value){
        // handel empty request
    if (!value) {
        const error = document.getElementById("error-content");
        error.innerHTML = "You have to chose a city!";
        clearContent();
        return;
    }else{
        const error = document.getElementById("error-content");
        error.innerHTML = "";
        showContent();

    }
}

function handelWrongCityError(value){
    if(value === 400){
        const error = document.getElementById("error-content");
        error.innerHTML = "The city you chose does not exist!";
        clearContent();
        return;
    }else{
        const error = document.getElementById("error-content");
        error.innerHTML = "";
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

function viewMap(lat, lon){
    if (map === null){
        map = L.map('map').setView([lat, lon], 1);
        L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=A3JyLxSXdwFwRgli2Mbx', {
            attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        }).addTo(map);
        marker = L.marker([lat, lon]).addTo(map)
    }else{
        map.removeLayer(marker)
        map.setView([lat, lon], 1);
        marker = L.marker([lat, lon]).addTo(map)
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

        var city = document.getElementById("city").value.toLowerCase();
        var resultData = document.getElementById("result");  
        var forecast = document.getElementById("forecast");

        // handel empty request
        handelEmptyError(city);

        const urlVisualCrossing = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?key=" + apiKeyVisualCrossing;
        const responseVisualCrossing = await fetch(urlVisualCrossing)

        // handel requet of a wrong city
        handelWrongCityError(responseVisualCrossing.status);

        // local storage setting
        setLocalStorage(city);

        const dataVisualCrossing = await responseVisualCrossing.json(); 
        
        
       
        // invoke toggle 
        invokeToggle();
      
        forecast.innerHTML = "";
        // forecast.innerHTML += "<table>";

        buildWeatherFrame(resultData, dataVisualCrossing.days, mainTemps)

        settingSecondaryFramesTemps();

        // forecast.innerHTML += "</table>";

        // alerts
        viewAlerts(dataVisualCrossing.alerts[0]);

        // invoke a map from leaflet website
        viewMap(dataVisualCrossing.latitude,dataVisualCrossing.longitude);

    } catch (error) {
        console.error(error);
    }
}


