var API_KEY = "a5bf40db7fad9047f675fef8dbcc9239";

var form = document.getElementById("search-form");
var input = document.getElementById("search-input");
var city;

var weatherName = document.getElementById("weather-name");
var weatherIcon = document.getElementById("weather-icon");
var weatherTemp = document.getElementById("weather-temp");
var weatherDesc = document.getElementById("weather-description");
var weatherSave = document.getElementById("weather-save");
var weatherList = document.getElementById("weather-list");

var savedLocations = [];
console.log('savedLocations pageload', savedLocations);

loadSavedQueries();
console.log(savedLocations);

weatherSave.addEventListener("click", function(e) {
    e.preventDefault();
    writeWeatherQuery(city);
})

function loadSavedQueries() {
    // JSON.parse will throw an exception if the JSON is invalid.
    // Best practice is to catch that exception and provide a fallback.
    try {
        var queriesJson = localStorage.getItem("weather-queries");
        // If there are no saved queries, queriesJson will be null.
        // Provide a fallback to an empty array using the || syntax.
        var queries = JSON.parse(queriesJson) || [];
        savedLocations = queries;
    } catch (e) {
        savedLocations = [];
    }

    displaySavedQueries();
    if(savedLocations.length > 0){
        city = savedLocations[0];
        queryWeatherApi(city);
    }
}

function writeWeatherQuery(query) {
    if(!savedLocations.includes(query)){
        savedLocations.push(query);
        saveWeatherQueries();
    }
}

function saveWeatherQueries() {
    var queriesJson = JSON.stringify(savedLocations);
    localStorage.setItem("weather-queries", queriesJson);
    displaySavedQueries();
}

function displaySavedQueries() {
    // When you want to render the list of queries,
    // it is easiest to clear the existing li elements
    // and re-render the entire list.
    // innerHTML = "" is an easy way to "reset" the contents of an element.
    weatherList.innerHTML = "";
    if(savedLocations.length != 0){
        var my_locations = document.createElement("li");
        my_locations.innerHTML = "My Locations";
        my_locations.classList.add("list-group-item");
        weatherList.appendChild(my_locations);
    }
    savedLocations.forEach(function (query) {
        var queryElement = document.createElement("li");
        
        // queryElement.textContent = query;

        var queryName = document.createElement("a");
        queryName.setAttribute("href", "#");
        queryName.innerHTML = query;
        queryName.addEventListener("click", function (e) {
            city = query;
            queryWeatherApi(query);
        });
        queryName.classList.add("query-name");

        var removeQuery = document.createElement("a");
        removeQuery.setAttribute("href", "#");
        removeQuery.innerHTML = "Remove";
        removeQuery.addEventListener("click", function (e) {
            removeQueryFromList(query);
        });
        removeQuery.classList.add("remove-query");


        queryElement.appendChild(queryName);
        queryElement.appendChild(removeQuery);
        queryElement.classList.add("list-group-item");


        weatherList.appendChild(queryElement);
    })
}

function removeQueryFromList(queryToRemove) {
    var filteredList = savedLocations.filter(function (savedLocation) {
        return queryToRemove !== savedLocation;
    })

    savedLocations = filteredList;
    saveWeatherQueries();
}

function queryWeatherApi(query) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + API_KEY + "&units=imperial";
    var icon_url_1 = "http://openweathermap.org/img/wn/"
    var icon_url_2 = "@2x.png";
    var invalid_location = document.getElementById("invalid-location");

    var fetchPromise = fetch(url);
    fetchPromise.then(function (response) {
        console.log('response', response);

        response.json().then(function (data) {
            if (response.status === 200) {
                weatherName.classList.remove("hidden");
                weatherSave.classList.remove("hidden");
                weatherIcon.classList.remove("hidden");
                weatherTemp.classList.remove("hidden");
                weatherDesc.classList.remove("hidden");
                invalid_location.classList.add("hidden");

                console.log('data', data);

                var name = data.name;
                var temp = parseInt(data.main.temp, 10);
                var icon = data.weather[0].icon;
                var short_description = data.weather[0].main;
                var long_description = data.weather[0].description;

                console.log(name, temp);

                weatherName.textContent = name;
                weatherIcon.src = icon_url_1 + icon + icon_url_2;
                weatherTemp.textContent = temp + "°";
                weatherDesc.textContent = short_description + " (" + long_description + ")";
            } else {
                weatherName.classList.add("hidden");
                weatherSave.classList.add("hidden");
                weatherIcon.classList.add("hidden");
                weatherTemp.classList.add("hidden");
                weatherDesc.classList.add("hidden");
                invalid_location.classList.remove("hidden");
                console.error('error', data);
            }
        })
    })
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    var query = input.value;
    city = query;

    queryWeatherApi(query);
})