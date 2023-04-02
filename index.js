const tab1 = document.querySelector(".firstTab");
const tab2 = document.querySelector(".secondTab");
const grantLocationScreen = document.querySelector(".grantLocationScreen");
const loadingScreen = document.querySelector(".loadingScreen");
const loadingText = document.querySelector(".loadingText");
const userWeatherScreen = document.querySelector(".userWeatherScreen");
const searchWeatherScreen = document.querySelector(".searchWeatherScreen");
const GrantAccessBtn = document.querySelector(".GrantAccessBtn");
const searchForm = document.querySelector(".searchForm");
const inputSearch = document.querySelector(".inputSearch");
const notFound = document.querySelector(".not-found");
const UpdateWeat = document.querySelector(".UpdateWeat");
const container = document.querySelector(".container");
const wrapper = document.querySelector("#wrapper");
const speakWeat = document.querySelector(".speakWeat");
const newsDiv = document.querySelector(".newsDiv");
const cityTime = document.querySelector(".cityTime");
const localTime = document.querySelector(".localTime");
const advice = document.querySelector(".advice");
const adviceDiv = document.querySelector(".adviceDiv");

const API_KEY = "8e36ff72238bd72067aad65916e9f86a";
const TIME_API_KEY = "2RX09LRUXWLK";
const GOOGLE_API_KEY = "AIzaSyAPmZEY3Rw7dJ8XFet3Q_ZCHaz1IvROkeo";
const Google_search_engine_id = "c2b5d6e0a9f974646";
let weatherObject, latitude, longitude;
let pause = false;
let keep = false;
let currentTab = tab1;
tab1.classList.add("currentTab");
getfromSessionStorage();
// fetchTime();

//tab switch func
function switchTab(newTab) {
  if (currentTab != newTab) {
    currentTab.classList.remove("currentTab");
    currentTab = newTab;
    currentTab.classList.add("currentTab");
    keep = false;

    if (!searchWeatherScreen.classList.contains("active")) {
      searchWeatherScreen.classList.add("active");
      grantLocationScreen.classList.remove("active");
      // UpdateWeat.style.display = "flex";
      userWeatherScreen.classList.remove("active");
      adviceDiv.classList.remove("active");
      newsDiv.classList.remove("active");
      speakWeat.classList.remove("active");
    } else {
      searchWeatherScreen.classList.remove("active");
      userWeatherScreen.classList.remove("active");
      adviceDiv.classList.remove("active");
      newsDiv.classList.remove("active");
      speakWeat.classList.remove("active");
      notFound.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

tab1.addEventListener("click", () => {
  // UpdateWeat.style.removeProperty("display");
  switchTab(tab1);
});

tab2.addEventListener("click", () => {
  UpdateWeat.style.display = "none";
  switchTab(tab2);
});

//fetching prev stored location
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (localCoordinates) {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  } else {
    grantLocationScreen.classList.add("active");
    UpdateWeat.style.display = "none";

  }
}

// window.onunload = function(){
//   sessionStorage.removeItem("user-coordinates");
//   // return '';
// };

//fetching weather form api
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // console.log(lat,lon);

  grantLocationScreen.classList.remove("active");
  UpdateWeat.style.display = "flex";
  container.style.opacity = "0.3";
  loadingScreen.classList.add("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    container.style.opacity = "1";
    userWeatherScreen.classList.add("active");
    adviceDiv.classList.add("active");
    newsDiv.classList.add("active");
    speakWeat.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    container.style.opacity = "1";
    console.log(error);
  }
}

//updating weather on ui
function renderWeatherInfo(data) {
  const cityName = document.querySelector(".cityName");
  const flag = document.querySelector(".flag");
  const condition = document.querySelector(".condition");
  const conditionImg = document.querySelector(".conditionImg");
  const temp = document.querySelector(".temp");
  const windSpeed = document.querySelector(".windSpeed");
  const humidity = document.querySelector(".humidity");
  const cloud = document.querySelector(".cloud");

  cityName.innerText = data?.name;
  flag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  condition.innerText = data?.weather[0]?.description;
  conditionImg.src = `http://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
  temp.innerText = `${data?.main?.temp} °C`;
  windSpeed.innerText = `${data?.wind.speed} m/s`;
  humidity.innerText = `${data?.main.humidity}%`;
  cloud.innerText = `${data?.clouds.all}%`;

  fetchDesc(condition.innerText);
  weatherObject = {
    cityname: `Current Weather condition of ${cityName.innerText} is, ${condition.innerText}y..`,
    temperature: `Its current temperature is ${temp.innerText}.`,
    wind: `and wind speed is currently at ${data?.wind.speed} metres per second.`,
    humidity: `with humidity at ${humidity.innerText}.`,
  };
  fetchNews(data.name);
  latitude = data.coord.lat;
  longitude = data.coord.lon;
  keep = false;
  setTimeout(() => {
    fetchTime();
  }, 2000);
}

UpdateWeat.addEventListener("click", () => {
  userWeatherScreen.classList.remove("active");
  adviceDiv.classList.remove("active");
  newsDiv.classList.remove("active");
  speakWeat.classList.remove("active");
  loadingText.innerText = "Updating Weather";
  getGeoLocation();
});

GrantAccessBtn.addEventListener("click", () => {
  getGeoLocation();
});

//allow location and fetch current pos
function getGeoLocation() {
  if (navigator.geolocation) {
    grantLocationScreen.classList.remove("active");
    UpdateWeat.style.display = "flex";
    container.style.opacity = "0.3";
    loadingScreen.classList.add("active");
    navigator.geolocation.getCurrentPosition(showPosition, DeclinedError);
  } else {
    window.alert("OLD DOES not support");
  }
}

//if user declined location access
function DeclinedError() {
  alert("Location Declined");
  loadingScreen.classList.remove("active");
  container.style.opacity = "1";
  grantLocationScreen.classList.add("active");
  UpdateWeat.style.display = "none";
}

//store current location co-ord
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
  loadingScreen.classList.remove("active");
  container.style.opacity = "1";
  loadingText.innerText = "Loading";
}

//search typed city weather
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let typedName = inputSearch.value;
  if (typedName === "") {
    return;
  } else {
    fetchSearchWeather(typedName);
    fetchNews(typedName);
  }
});

//search weather fun
async function fetchSearchWeather(typedName) {
  container.style.opacity = "0.3";
  loadingScreen.classList.add("active");
  userWeatherScreen.classList.remove("active");
  adviceDiv.classList.remove("active");
  newsDiv.classList.remove("active");
  speakWeat.classList.remove("active");
  notFound.classList.remove("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${typedName}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    userWeatherScreen.classList.add("active");
    adviceDiv.classList.add("active");
    newsDiv.classList.add("active");
    speakWeat.classList.add("active");
    loadingScreen.classList.remove("active");
    container.style.opacity = "1";
    renderWeatherInfo(data);
  } catch (e) {
    console.log(e);
    notFound.classList.add("active");
    userWeatherScreen.classList.remove("active");
    adviceDiv.classList.remove("active");
    newsDiv.classList.remove("active");
    speakWeat.classList.remove("active");
  }
}

//speak weather
function speakWeather() {
  if ("speechSynthesis" in window) {
    var messages = new SpeechSynthesisUtterance();
    const voices = speechSynthesis.getVoices();
    messages.voice = voices.find((voice) => voice.lang === "en-US");
    if (pause == false) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      }
      speakWeat.src = "./assets/mute.png";
      pause = true;
      const speech = `${weatherObject.cityname} ${weatherObject.temperature} ${weatherObject.wind} ${weatherObject.humidity}`;
      messages.text = "Hii, " + speech;
      speechSynthesis.speak(messages);
    } else {
      speechSynthesis.pause();
      pause = false;
      speakWeat.src = "./assets/volume.png";
    }
  } else {
    alert("Broweser don't support speech");
  }
}

speakWeat.addEventListener("click", () => {
  // pause=!pause;
  speakWeather();
});

//new Fetching
async function fetchNews(typedName) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${typedName}+weather+news&key=${GOOGLE_API_KEY}&cx=${Google_search_engine_id}&num=10&fields=items(title,snippet,link)`
    );
    const data = await response.json();
    // console.log(data);

    newsDiv.replaceChildren();

    var h3 = document.createElement("h3");
    h3.innerText = "Weather News of Location";
    newsDiv.appendChild(h3);
    for (let index = 0; index < data.items.length; index++) {
      var div = document.createElement("div");
      div.classList.add("newsAdd");

      var a = document.createElement("a");
      a.classList.add("newsHead");
      a.innerText = data.items[index].title;
      a.href = data.items[index].link;
      a.target="_blank";

      var p = document.createElement("p");
      p.classList.add("newsDesc");
      p.innerText = data.items[index].snippet;

      div.appendChild(a);
      div.appendChild(p);
      newsDiv.appendChild(div);
    }
  } catch (error) {
    console.log(error);
  }
}

//local time fetching
async function fetchTime() {
  // keep=false;
  try {
    const response = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIME_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`
    );
    const data = await response.json();
    // localTime.innerText=data.formatted;
    let array = data.formatted.split(" ");
    var date = array[0];
    var time = array[1];
    // console.log(time);
    keep = true;
    showTime(time);
  } catch (error) {
    console.log(error);
  }
}

//continous time incrementation
let count = 0;
var session;
async function showTime(time) {
  if (keep) {
    let array = time.split(":");
    var hours = parseInt(array[0]);
    var min = parseInt(array[1]);
    var sec = parseInt(array[2]) + count;
    if (count == 0) {
      session = "PM";
      if (hours >= 12) {
      } else {
        session = "AM";
      }
    }

    if (sec == 60) {
      min++;
      sec = 0;
    }
    if (min == 60) {
      hours++;
      min = 0;
    }

    if (hours == 0) {
      hours = 12;
    }
    // if (hours >= 12) {
    //   session = session=="PM"?"AM":"PM";
    // }
    if (hours > 12) {
      hours = hours - 12;
    }
    hours = hours < 10 ? "0" + hours : hours;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    let currTime = hours + ":" + min + ":" + sec + " " + session;
    localTime.innerText = currTime;
    // console.log(currTime);
    count = 1;
    setTimeout(() => {
      showTime(currTime);
    }, 1000);
  } else {
    count = 0;
    session = "";
    clearTimeout();
    return;
  }
}

function fetchDesc(condition) {

  console.log(condition);
  if (condition.includes("snow") || condition.includes("sleet")) {
    advice.innerText ="Maintain safe stopping distances, Steer gently into skids";
    wrapper.style.backgroundImage = `url("https://images.unsplash.com/photo-1483664852095-d6cc6870702d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80")`;
  } 
  else if (condition.includes("rain") || condition.includes("drizzle")) {
    advice.innerText = "Carry umbrella, Steer gently into skids, ";
    wrapper.style.backgroundImage = `url("https://images.unsplash.com/photo-1548232979-6c557ee14752?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80")`;
  } 
  else if (condition.includes("thunderstorm")) {
    advice.innerText = "Avoid trees, water bodies and high rise buildings";
    wrapper.style.backgroundImage = `url("https://images.unsplash.com/photo-1548232979-6c557ee14752?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80")`;
  } 
  else if (condition.includes("clear")) {
    advice.innerText = "Bright day, Good to go";
    wrapper.style.backgroundImage = `url("https://images.unsplash.com/photo-1476673160081-cf065607f449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80")`;
  }
  else if (condition.includes("ash") || condition.includes("tornado") || condition.includes("squalls")) {
    advice.innerText = "Get to some safer place ASAP away from windows";  
    wrapper.style.backgroundImage = `url("https://images.unsplash.com/photo-1581059729226-c493d3086748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2059&q=80")`;
  } 
  else{
    advice.innerText = "Turn on fog lights, Go slow";
    wrapper.style.backgroundImage = 'url("https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1992&q=80")';
  }
}

