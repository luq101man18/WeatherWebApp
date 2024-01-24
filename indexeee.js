var map = null; 
var marker = null;  

const apiKeyVisualCrossing = "FQ52NM2JK4JXEQZVGZJ3PS3HW"

async function getData() {
    try {

        var city = document.getElementById("city").value;
        var newC = city.toLowerCase();

        // handel empty request
        if(!newC){
            alert("You have to choose a city!");
            const cityInput = document.getElementById("city");
            cityInput.style.border = "2px solid red";
            return;
        }else{
            const cityInput = document.getElementById("city");
            cityInput.style.border = "";
        }

        const urlVisualCrossing = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + newC + "?key=" + apiKeyVisualCrossing;
        const responseVisualCrossing = await fetch(urlVisualCrossing)

        // handel requet of a wrong city
        if(responseVisualCrossing.status === 400){
            alert("The city you entered wasn't found!");
            const cityInput = document.getElementById("city");
            cityInput.style.border = "2px solid red";
            return;
        }
        
        const dataVisualCrossing = await responseVisualCrossing.json(); 
        

        var resultData = document.getElementById("result");  

        var forecast = document.getElementById("forecast");
        forecast.innerHTML = "";
        forecast.innerHTML += "<table>";

        for (let index = 0; index <= 5; index++) {

            if(index<1){
                resultData.innerHTML = "";
                resultData.innerHTML += "<h3> Date: " + dataVisualCrossing.days[index].datetime + "</h3>"
                resultData.innerHTML += "<br><h2> Weather Description: " + dataVisualCrossing.days[index].description + "</h2></br>"
                resultData.innerHTML += "<h3> Temperature: " + ((dataVisualCrossing.days[index].temp - 32 )*(5/9)).toFixed(2)+ "</h3>"
                resultData.innerHTML += "<h3> Feels Like: " + ((dataVisualCrossing.days[index].feelslike))+ "</h3>"
                resultData.innerHTML += "<h3> Humidity: " + ((dataVisualCrossing.days[index].humidity))+ "</h3>"
                resultData.innerHTML += "<h3> Pressure: " + ((dataVisualCrossing.days[index].pressure))+ "</h3>"

                var resultLogo = document.getElementById("logoresult");
                resultLogo.innerHTML = "";
                if(dataVisualCrossing.days[index].conditions.includes("Clear")){
                    resultLogo.innerHTML += "<h1><i class=\"fa-solid fa-sun\"></i></h1>"
                } else if (dataVisualCrossing.days[index].conditions.includes("cloudy")) {
                    resultLogo.innerHTML += "<h1><i class=\"fa-solid fa-cloud\"></i></h1>"
                } else if (dataVisualCrossing.days[index].conditions.includes("Snow")){
                    resultLogo.innerHTML += "<h1><i class=\"fa-solid fa-snowflake\"></i></h1>"
                } else if (dataVisualCrossing.days[index].conditions.includes("Rain")){
                    resultLogo.innerHTML += "<h1><i class=\"fa-solid fa-cloud-rain\"></i></h1>"
                } else{

                }
            }else{    
                forecast.innerHTML += "<div class=\"forecast-background\" id=\"weatherImage"+index+"\">";
                var forecastImage = document.getElementById("weatherImage"+index);
                forecastImage.innerHTML += "<tr>"
                forecastImage.innerHTML += "<td>" + dataVisualCrossing.days[index].datetime + "</td>"
                forecastImage.innerHTML += "<br><th>" + dataVisualCrossing.days[index].conditions + "</th></br>"
                forecastImage.innerHTML += "<td>" + ((dataVisualCrossing.days[index].temp - 32 )*(5/9)).toFixed(2)+ "</td>"
            }
            if((dataVisualCrossing.days[index].conditions.includes("cloudy"))) {
                var images = document.getElementById("weatherImage"+index.toString());
                images.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(./images/clouds.jpg)";
                console.log("true");
            }else if (dataVisualCrossing.days[index].conditions.includes("snow")){
                var images = document.getElementById("weatherImage"+index.toString());
                images.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(./images/snow.jpg)";
                console.log("true");
            }else if (dataVisualCrossing.days[index].conditions.includes("rain")){
                var images = document.getElementById("weatherImage"+index.toString());
                images.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(./images/rain2.jpg)";
                console.log("true");
            }else if (dataVisualCrossing.days[index].conditions.includes("Overcast")){
                var images = document.getElementById("weatherImage"+index.toString());
                images.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(./images/overcast.jpg)";
                console.log("true");
            }
            else{
                var images = document.getElementById("weatherImage"+index.toString());
                images.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(./images/clear.jpg)";
                console.log("true");
            }
        }
        forecast.innerHTML += "</table>";

        const newAlert = dataVisualCrossing.alerts[0];
        var alerts = document.getElementById("alertsAdisory");
        alerts.innerHTML = "";
        if(newAlert!= null){    
            alerts.innerHTML += "<p>" + newAlert.event + "</p>";
            alerts.innerHTML += "<p>" + newAlert.headline + "</p>";
        }else{
            alerts.innerHTML += "<p> There are no alerts, enjoy your day! </p>";
        }

        // invoke a map from leaflet website
        if (map === null){
            map = L.map('map').setView([dataVisualCrossing.latitude,dataVisualCrossing.longitude], 1);
            L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=A3JyLxSXdwFwRgli2Mbx', {
                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            }).addTo(map);
            marker = L.marker([dataVisualCrossing.latitude,dataVisualCrossing.longitude]).addTo(map)
        }else{
            map.removeLayer(marker)
            map.setView([dataVisualCrossing.latitude,dataVisualCrossing.longitude], 1);
            marker = L.marker([dataVisualCrossing.latitude,dataVisualCrossing.longitude]).addTo(map)
        }
        
    } catch (error) {
        console.error(error);
    }
}

