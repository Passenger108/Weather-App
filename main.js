const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');



//userInfo Container Elements used in rendering the information 
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windSpeed = document.querySelector("[data-windSpeed]");
const humidity = document.querySelector("[data-humidity]");





let currentTab = userTab;
const KEY = "592f63ce479bc5170e3a942dc288699c";
currentTab.classList.add("current-tab");




function switchTab (clickedTab) {
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");

        getFromSessionStorage();
    }
}


function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates) {
    const {lat, long} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active"); 


    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${KEY}
`);
         const result = await response.json();

         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");
         renderWeatherInfo(data);
    }catch (error){
        loadingScreen.classList.remove("active");
        // hw
    }

}

function renderWeatherInfo(weatherInfo) {

}






userTab.addEventListener('click',()=>{
    // pass the clicked tab
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //pass the clicked tab
    switchTab(searchTab);
});



