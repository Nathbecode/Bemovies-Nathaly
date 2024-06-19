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
const swiperResultsElem = document.querySelector(".swiper-results");
const swiperWrapperResults = document.querySelector(".swiper-wrapper");
const swiperScrollbarResults = document.querySelector(
  ".swiper-scrollbar-results"
);
const swiperLatestElem = document.querySelector(".swiper-latest");
const swiperWrapperLatest = document.querySelector(".swiper-wrapper2");
const swiperScrollbarLatest = document.querySelector(
  ".swiper-scrollbar-latest"
);
const swiperGenreElem = document.querySelector(".swiper-genre");
const swiperWrapperGenre = document.querySelector(".swiper-wrapper3");
const swiperScrollbarGenre = document.createElement("div");
swiperScrollbarGenre.classList.add(
  "swiper-scrollbar",
  "swiper-scrollbar-genre"
);
swiperGenreElem.appendChild(swiperScrollbarGenre);

// Classes for Swiper.
swiperLatestElem.classList.add("swiper");
swiperWrapperLatest.classList.add("swiper-wrapper");
swiperScrollbarLatest.classList.add("swiper-scrollbar");
swiperResultsElem.classList.add("swiper");
swiperWrapperResults.classList.add("swiper-wrapper1");
swiperScrollbarResults.classList.add("swiper-scrollbar");
swiperGenreElem.classList.add("swiper");
swiperWrapperGenre.classList.add("swiper-wrapper");

// Events.
openModalBtn.addEventListener("click", openSignin);
closeBtn.addEventListener("click", closeSignin);
searchBtn.addEventListener("click", search);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

// Function calls.
removeSwiperSlides();
const genres = await getGenres();
let genreId = genres.find((x) => x.name == "Animation")["id"];
await displayMoviesByGenre(genreId);
await displayLatestMovies();

// Functions.
function openSignin() {
  modal.style.display = "block";
}

function closeSignin() {
  modal.style.display = "none";
}

function removeSwiperSlides() {
  let swiperSlides = document.querySelectorAll(".swiper-slide");
  for (let i = 0; i < swiperSlides.length; i++) {
    swiperSlides[i].remove();
  }
}

async function getGenres() {
  const uri = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
  const response = await fetch(uri);
  const json = await response.json();
  return json["genres"];
}

async function getMoviesByGenre(genreId) {
  const uri = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}&api_key=${apiKey}`;
  const response = await fetch(uri);
  const json = await response.json();
  return json;
}

async function displayMoviesByGenre(genreId) {
  const response = await getMoviesByGenre(genreId);
  const results = response["results"];
  if (results.length < 1) return;
  createSwiper(results, "genre", swiperWrapperGenre, swiperGenreElem);
}

async function search() {
  const inputValue = input.value;
  const apiResponse = await getMoviesBySearch(inputValue);
  const results = apiResponse["results"];
  if (results.length < 1) return;
  displaySearchResults(results);
}

async function getMoviesBySearch(movieTitle) {
  const uri = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;
  const response = await fetch(uri);
  const json = await response.json();
  return json;
}

function displaySearchResults(results) {
  createSwiper(results, "results", swiperWrapperResults, swiperResultsElem);
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

  createSwiper(results, "latest", swiperWrapperLatest, swiperLatestElem);
}

function createSwiper(results, swiperSection, swiperWrapper, swiperElem) {
  for (let i = 0; i < results.length; i++) {
    const swiperSlide = document.createElement("div");
    swiperSlide.classList.add(`swiper-slide-${swiperSection}`);
    swiperSlide.classList.add("swiper-slide");
    const image = document.createElement("img");
    const poster = results[i]["poster_path"];
    image.src = `https://image.tmdb.org/t/p/w500/${poster}`;
    swiperSlide.appendChild(image);
    swiperWrapper.appendChild(swiperSlide);
  }
  const swiperNext = createSwiperNext(swiperSection);
  const swiperPrev = createSwiperPrev(swiperSection);
  swiperElem.appendChild(swiperPrev);
  swiperElem.appendChild(swiperNext);

  const swiper = new Swiper(`.swiper-${swiperSection}`, {
    direction: "horizontal",
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
      nextEl: `.swiper-button-next-${swiperSection}`,
      prevEl: `.swiper-button-prev-${swiperSection}`,
    },
    scrollbar: {
      el: `.swiper-scrollbar-${swiperSection}`,
    },
  });
}

function createSwiperNext(swiperSection) {
  const swiperNext = document.createElement("div");
  swiperNext.classList.add(
    "swiper-button-next",
    `swiper-button-next-${swiperSection}`
  );
  const nextImg = document.createElement("img");
  nextImg.src = "./Right.png";
  swiperNext.appendChild(nextImg);
  return swiperNext;
}

function createSwiperPrev(swiperSection) {
  const swiperPrev = document.createElement("div");
  swiperPrev.classList.add(
    "swiper-button-prev",
    `swiper-button-prev-${swiperSection}`
  );
  const prevImg = document.createElement("img");
  prevImg.src = "./Left.png";
  swiperPrev.appendChild(prevImg);
  return swiperPrev;
}
