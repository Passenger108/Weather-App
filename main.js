const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const searchInput = document.querySelector('[data-searchInput]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');
const grantButton = document.querySelector('[data-grantAccess]');



//userInfo Container Elements used in rendering the information 
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windSpeed = document.querySelector("[data-windSpeed]");
const humidity = document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]");





let currentTab = userTab;
const KEY = "592f63ce479bc5170e3a942dc288699c";
currentTab.classList.add("current-tab");
getFromSessionStorage();



function switchTab(clickedTab) {
    if (currentTab != clickedTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getFromSessionStorage();
        }
    }
}


function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates) {
    const { lat, long } = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");


    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${KEY}`);
        const result = await response.json();

        if(!response.ok) throw new Error();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(result);
    } catch (error) {
        loadingScreen.classList.remove("active");
        showError("Server is not reachable");
        console.log("error encountered in fetchUserWeatherInfo function");
    }

}

function renderWeatherInfo(weatherInfo) {
    cityName.textContent = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.textContent = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.textContent = `${(weatherInfo?.main?.temp - 273).toFixed(2)}\u00B0C`;
    windSpeed.textContent = `${weatherInfo?.wind?.speed}m/s`;
    humidity.textContent = `${weatherInfo?.main?.humidity}%`;
    cloudiness.textContent = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        showError("No Access to Geolocation, Check your device!");
        console.log("No Access to GeoLocation of the user");
    }
}

function showPosition(position) {
    const userCoords = {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoords));
    console.log("here");
    fetchUserWeatherInfo(userCoords);
}


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    // userInfoContainer.classList.remove("active");
    // grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`);
        searchInput.value="";
        if(!response.ok) throw new Error("invalidInput");

        const result = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(result);
    } catch (error) {
        loadingScreen.classList.remove("active");
        if(error.message === "invalidInput")
            showError("Invalid Input,  Enter Valid Names!");
        else
            showError("Server is not reachable");
    }
}

function showError (message){
    document.querySelector(".error-text").innerText=message;
    document.querySelector(".error-box").style.display = "flex";
    setTimeout(closeError,1500);
}
function closeError (){
    document.querySelector(".error-box").style.display = "none";
}




userTab.addEventListener('click', () => {
    // pass the clicked tab
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    //pass the clicked tab
    switchTab(searchTab);
});




grantButton.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (searchInput.value === "") return;

    fetchSearchWeatherInfo(searchInput.value.trim());
});