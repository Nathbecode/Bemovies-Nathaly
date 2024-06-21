// Import: API key OR bearer token.
// import { returnKey } from "./return-key.js";
import { returnBearerToken } from "./return-key.js";

// Variable: API key OR bearer token.
// const apiKey = returnKey();
const bearerToken = returnBearerToken();

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${bearerToken}`,
  },
};


// Query selectors.
const unorderedLists = document.querySelectorAll("ul");
const ulHtml = `<ul>
<li><a href="#section-results">Search</a></li>
<li><a href="#section-latest">Latest</a></li>
<li><a href="#genre-search">Genres</a></li>
<li><a class="openSignupModalBtn">Register</a></li>
<li><a class="openLoginModalBtn">Signin</a></li>
</ul>`;
unorderedLists[0].innerHTML = ulHtml;
unorderedLists[2].innerHTML = ulHtml;

const openLoginModalBtns = document.querySelectorAll(".openLoginModalBtn");
const openSignupModalBtns = document.querySelectorAll(".openSignupModalBtn");
const closeBtn = document.querySelectorAll(".close")[0];
const closeBtnMovie = document.querySelectorAll(".close")[1];
const modal = document.querySelector(".modal");
const modalHidden = document.querySelector(".modalhidden");
const login = document.querySelector(".login");
const signup = document.querySelector(".signin");
const signinSwitcher = document.querySelectorAll(".signin-btn")[0];
const loginSwitcher = document.querySelector(".first-login");
const imgFilm = document.querySelector(".imgfilm");
const contentFilm = document.querySelector(".contentfilm");
const input = document.querySelector("#input");
const searchBtn = document.querySelector("#search-movie");
const divResults = document.querySelector(".div-results");
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
const genreHead = document.querySelector(".genre-head");
const genreHeadChildren = genreHead.children;
const genreUnorderedList = genreHeadChildren[1];
const genreListItems = genreUnorderedList.children;
genreListItems[0].children[0].classList.add("comedy");
genreListItems[0].children[0].removeAttribute("href");
genreListItems[1].children[0].classList.add("drama");
genreListItems[1].children[0].removeAttribute("href");
genreListItems[2].children[0].classList.add("action");
genreListItems[2].children[0].removeAttribute("href");
genreListItems[3].children[0].classList.add("romance");
genreListItems[3].children[0].removeAttribute("href");
genreListItems[4].children[0].classList.add("fantasy");
genreListItems[4].children[0].removeAttribute("href");
genreListItems[5].children[0].classList.add("animation");
genreListItems[5].children[0].removeAttribute("href");

const sectionResults = document.querySelector(".section-results");
sectionResults.id = "section-results";
const sectionLatest = document.querySelector(".section-latest");
sectionLatest.id = "section-latest";
const sectionGenre = document.querySelector(".genre-search");
sectionGenre.id = "genre-search";

const up = document.querySelector(".UP");
const notMemberYetAnchor = up.parentElement;
notMemberYetAnchor.removeAttribute("href");

// Classes for Swiper.
swiperLatestElem.classList.add("swiper");
swiperWrapperLatest.classList.add("swiper-wrapper");
swiperScrollbarLatest.classList.add("swiper-scrollbar");
swiperResultsElem.classList.add("swiper");
swiperWrapperResults.classList.add("swiper-wrapper1");
swiperScrollbarResults.classList.add("swiper-scrollbar");
swiperGenreElem.classList.add("swiper");
swiperWrapperGenre.classList.add("swiper-wrapper");

// Function calls.
divResults.classList.add("hidden");
modalHidden.classList.add("hidden");
modal.classList.add("hidden");
removeSwiperSlides();
const genres = await getGenres();
let genreId = genres.find((x) => x.name == "Comedy")["id"];
await displayMoviesByGenre(genreId);
await displayLatestMovies();

// Events.
openLoginModalBtns.forEach((btn) => btn.addEventListener("click", openLogin));
openSignupModalBtns.forEach((btn) => btn.addEventListener("click", openSignin));

closeBtn.addEventListener("click", closeSigninModal);
signinSwitcher.addEventListener("click", openSignin);
loginSwitcher.addEventListener("click", openLogin);
up.addEventListener("click", openSignin);
closeBtnMovie.addEventListener("click", closeMovieModal);
searchBtn.addEventListener("click", search);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});
genreUnorderedList.addEventListener("click", async (e) => {
  removeSlidesInWrapper(".swiper-wrapper3");
  let genreId = genres.find((x) => x.name == e.target.innerText)["id"];
  await displayMoviesByGenre(genreId);
});

// Functions.
function openSigninModal() {
  modal.classList.remove("hidden");
}

function closeSigninModal() {
  modal.classList.add("hidden");
  signup.classList.add("hidden");
  login.classList.remove("hidden");
}

function openSignin() {
  openSigninModal();
  login.classList.add("hidden");
  loginSwitcher.classList.remove("signinBtnActive");
  signup.classList.remove("hidden");
  signinSwitcher.classList.add("signinBtnActive");
  //signinBtnActive
}

function openLogin() {
  openSigninModal();
  signup.classList.add("hidden");
  signinSwitcher.classList.remove("signinBtnActive");
  login.classList.remove("hidden");
  loginSwitcher.classList.add("signinBtnActive");
  //signinBtnActive
}

function closeMovieModal() {
  modalHidden.classList.add("hidden");
  resetMovieModal();
}

function resetMovieModal() {
  imgFilm.innerHTML = "";
  contentFilm.innerHTML = "";
}

function removeSwiperSlides() {
  let swiperSlides = document.querySelectorAll(".swiper-slide");
  for (let i = 0; i < swiperSlides.length; i++) {
    swiperSlides[i].remove();
  }
}

function removeSlidesInWrapper(wrapperName) {
  const wrapper = document.querySelector(wrapperName);
  let children = Array.from(wrapper.children);
  for (let i = 0; i < children.length; i++) {
    children[i].remove();
  }
}

async function getGenres() {
  try {
    const uri = `https://api.themoviedb.org/3/genre/movie/list`;
  const response = await fetch(uri, options);
  const json = await response.json();
  return json["genres"];
  }
  catch (ex) 
  {
    console.log(ex);
  }
}

async function getMoviesByGenre(genreId) {
  const uri = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`;
  const response = await fetch(uri, options);
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
  divResults.classList.remove("hidden");
  removeSlidesInWrapper(".swiper-wrapper1");
  const inputValue = input.value;
  const apiResponse = await getMoviesBySearch(inputValue);
  const results = apiResponse["results"];
  if (results.length < 1) return;
  displaySearchResults(results);
}

async function getMoviesBySearch(movieTitle) {
  const uri = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1`;
  const response = await fetch(uri, options);
  const json = await response.json();
  return json;
}

function displaySearchResults(results) {
  createSwiper(results, "results", swiperWrapperResults, swiperResultsElem);
}

async function getLatestMovies() {
  const uri = `https://api.themoviedb.org/3/movie/now_playing`;
  const response = await fetch(uri, options);
  const json = await response.json();
  return json;
}

async function displayLatestMovies() {
  const response = await getLatestMovies();
  const results = response["results"];
  if (results.length < 1) return;

  createSwiper(results, "latest", swiperWrapperLatest, swiperLatestElem);
}

function createSwiper(results, swiperSection, swiperWrapper, swiperElem) {
  for (let i = 0; i < results.length; i++) {
    const swiperSlide = document.createElement("div");
    swiperSlide.classList.add(`swiper-slide-${swiperSection}`);
    swiperSlide.classList.add("swiper-slide");

    swiperSlide.addEventListener("click", () =>
      displayMovieModal(results[i]["id"])
    );

    const imgDiv = createImgDiv(results[i]["poster_path"]);
    swiperSlide.appendChild(imgDiv);

    const hoverDiv = createHoverDiv(results[i]);
    swiperSlide.appendChild(hoverDiv);

    swiperWrapper.appendChild(swiperSlide);
  }
  const swiperNext = createSwiperNext(swiperSection);
  const swiperPrev = createSwiperPrev(swiperSection);
  swiperElem.appendChild(swiperPrev);
  swiperElem.appendChild(swiperNext);

  const swiper = new Swiper(`.swiper-${swiperSection}`, {
    direction: "horizontal",
    slidesPerView: 4,
    spaceBetween: 5,
    navigation: {
      nextEl: `.swiper-button-next-${swiperSection}`,
      prevEl: `.swiper-button-prev-${swiperSection}`,
    },
    scrollbar: {
      el: `.swiper-scrollbar-${swiperSection}`,
    },
  });
}

async function displayMovieModal(movieId) {
  const response = await getMovieById(movieId);
  if (response["success"] === false) return;

  modalHidden.classList.remove("hidden");

  const img = document.createElement("img");
  const posterPath = response["poster_path"];
  img.src = `https://image.tmdb.org/t/p/w500/${posterPath}`;
  imgFilm.appendChild(img);

  const movieGenres = response["genres"].map((x) => x["name"]);
  const movieCast = response["credits"]["cast"]
    .slice(0, 5)
    .map((actor) => actor["name"]);

  const contentFilmHtml = `
    <p class="modal-movie-title">${response["original_title"]}</p>
    <p class="modal-movie-year">${response["release_date"].slice(0, 4)}</p>
    <div class="modal-imdb-rating">
      <div class="modal-imdb-star">
        <img src="./star.png" >
      </div>
      <p>${Math.round(response["vote_average"] * 10) / 10}</p>
    </div>
    <p class="modal-movie-genres">${movieGenres.join(" / ")}</p>
    <p class="modal-overview">${response["overview"]}</p>
    <p class="modal-cast">
      <span>CAST:</span>
      ${movieCast.join(", ")}
    </p>
  `;
  contentFilm.innerHTML = contentFilmHtml;
}

async function getMovieById(movieId) {
  const uri = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`;
  const response = await fetch(uri, options);
  const json = await response.json();
  return json;
}

function createImgDiv(posterPath) {
  const imgDiv = document.createElement("div");
  const image = document.createElement("img");
  image.src = `https://image.tmdb.org/t/p/w500/${posterPath}`;
  imgDiv.appendChild(image);
  imgDiv.classList.add("img-div");
  return imgDiv;
}

function createHoverDiv(movie) {
  const hoverDiv = document.createElement("div");
  const movieGenres = [];
  const genreIds = movie["genre_ids"];

  genreIds.forEach((id) => {
    genres.forEach((genre) => {
      if (genre["id"] === id) movieGenres.push(genre["name"]);
    });
  });

  hoverDiv.innerHTML = `
  <p class="movie-title">${movie["original_title"]}</p>
  <p class="movie-year">${movie["release_date"].slice(0, 4)}</p>
  <p class="movie-genres">${movieGenres.join(" / ")}</p>
  <div class="imdb-rating">
    <div class="imdb-star">
      <img src="./star.png" >
    </div>
    <p>${Math.round(movie["vote_average"] * 10) / 10}</p>
  </div>
  `;
  hoverDiv.classList.add("hover-div");
  return hoverDiv;
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
