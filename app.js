// Import: API key OR bearer token.
import { returnKey } from "./return-key.js";
// import { returnBearerToken } from "./return-key.js";

// Variable: API key OR bearer token.
const apiKey = returnKey();
// const bearerToken = returnBearerToken();

// Query selectors.
const openModalBtn = document.querySelector("#openModalBtn");
const closeBtn = document.querySelector(".close");
const modal = document.querySelector(".modal");
const input = document.querySelector("#input");
const searchBtn = document.querySelector("#search-movie");
const swiperWrapperLatest = document.querySelector(".swiper-wrapper2");

// Events.
openModalBtn.addEventListener("click", openSignin);
closeBtn.addEventListener("click", closeSignin);
searchBtn.addEventListener("click", search);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

const swiperLatest = new Swiper(".swiper-latest", {
  direction: "horizontal",

  slidesPerView: 4,

  navigation: {
    nextEl: ".swiper-button-next-latest",
    prevEl: ".swiper-button-prev-latest",
  },

  scrollbar: {
    el: ".swiper-scrollbar-latest",
  },
});

// Function calls.
// displayLatestMovies();

// Functions.
function openSignin() {
  modal.style.display = "block";
}

function closeSignin() {
  modal.style.display = "none";
}

async function search() {
  const inputValue = input.value;
  const apiResponse = await getMoviesBySearch(inputValue);
  console.log(apiResponse);
}

// First way, with API key
async function getMoviesBySearch(movieTitle) {
  const uri = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;
  const response = await fetch(uri);
  const json = await response.json();
  return json;
}

async function getLatestMovies() {
  const uri = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
  const response = await fetch(uri);
  const json = await response.json();
  return json;
}

async function displayLatestMovies() {
  const resp = await getLatestMovies();
  const results = resp["results"];
  if (results.length < 1) return;

  for (let i = 0; i < results.length; i++) {
    let swiperSlide = document.createElement("div");
    swiperSlide.classList.add("swiper-slide-latest");
    swiperSlide.classList.add("swiper-slide");
    const image = document.createElement("img");
    const poster = results[i]["poster_path"];
    image.src = `https://image.tmdb.org/t/p/w500/${poster}`;
    swiperSlide.appendChild(image);
    swiperWrapperLatest.appendChild(swiperSlide);
  }
}

//TODO : ajouter classes via DOM, pour latest swiper.