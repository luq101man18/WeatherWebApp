var map = null; 
var marker = null;  

async function getData() {
    try {
        const currentDate = new Date();

        var city = document.getElementById("city").value;
        var newC = city.toLowerCase();
        const apiKeyOpenMap = "3ad2ff31ad264022cd5760a54b738b8b";
        const apiKeyVisualCrossing = "FQ52NM2JK4JXEQZVGZJ3PS3HW"
        const urlOpenMap = "https://api.openweathermap.org/data/2.5/weather?q=" + (newC) + "&appid=" + apiKeyOpenMap;
        const urlVisualCrossing = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + newC + "?key=" + apiKeyVisualCrossing;
        const responseOpenMap = await fetch(urlOpenMap);
        const data = await responseOpenMap.json();
        
        // using visualCrossing we can get forecast for 15 days!
        const responseVisualCrossing = await fetch(urlVisualCrossing)
        const dataVisualCrossing = await responseVisualCrossing.json(); 

        console.log(data);
        console.log(dataVisualCrossing);
        console.log(dataVisualCrossing.days[1].conditions);
        console.log(dataVisualCrossing.days[1].temp);
        
        
        var resultData = document.getElementById("result");  
        resultData.innerHTML = "";
        resultData.innerHTML = "<h2> Weather Description: " + data.weather[0].description + "</h2>";
        resultData.innerHTML += "<h2> Temperature: " + ((data.main.temp - 273.15).toFixed(2)).toString() + "</h2>";
        resultData.innerHTML += "<h2> Feels Like: " + ((data.main.feels_like - 273.15).toFixed(2)).toString() + "</h2>";
        resultData.innerHTML += "<h2> humidity: " + data.main.humidity + "</h2>";
        resultData.innerHTML += "<h2> pressure: " + data.main.pressure + "</h2>";       
        
        var resultLogo = document.getElementById("logoresult");
        resultLogo.innerHTML = "";
        if(data.weather[0].main === "Clear"){
            resultLogo.innerHTML += "<h1><i class=\"fa-solid fa-sun\"></i></h1>"
        } else if (data.weather[0].main === "Clouds") {
            resultLogo.innerHTML += "<h1><i class=\"fa-solid fa-cloud\"></i></h1>"
        } else if (data.weather[0].main === "Snow"){
            resultLogo.innerHTML += "<h1><i class=\"fa-solid fa-snowflake\"></i></h1>"
        } else{

        }

        var forecast = document.getElementById("forecast");
        forecast.innerHTML = "";
        forecast.innerHTML += "<table>";

        for (let index = 0; index <= 5; index++) {
            forecast.innerHTML += "<div class=\"nextto\" id=\"weatherImage"+index+"\">";
            forecast.innerHTML += "<tr>"
            forecast.innerHTML += "<td>" + dataVisualCrossing.days[index].datetime + "</td>"
            forecast.innerHTML += "<br><th>" + dataVisualCrossing.days[index].conditions + "</th></br>"
            forecast.innerHTML += "<td>" + dataVisualCrossing.days[index].temp + "</td>"

            if(("Partially cloudy" ===  dataVisualCrossing.days[index].conditions)) {
                var images = document.getElementById("weatherImage"+index.toString());
                images.style.backgroundImage = "url(./images/clouds.jpg)";
                console.log("true");
            }else{
                console.log("false");
            }

            forecast.innerHTML += "</tr>"
            forecast.innerHTML += "</br>";
            forecast.innerHTML += "</div>"
        }
        forecast.innerHTML += "</table>";

        // invoke a map from leaflet website
        if (map === null){
            map = L.map('map').setView([data.coord.lat,data.coord.lon], 1);
            L.tileLayer('https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=A3JyLxSXdwFwRgli2Mbx', {
                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            }).addTo(map);
            marker = L.marker([data.coord.lat, data.coord.lon]).addTo(map)
        }else{
            map.removeLayer(marker)
            map.setView([data.coord.lat, data.coord.lon], 1);
            marker = L.marker([data.coord.lat, data.coord.lon]).addTo(map)
        }
        
    } catch (error) {
        console.error(error);
    }
}

