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

// Events.
openModalBtn.addEventListener("click", openSignin);
closeBtn.addEventListener("click", closeSignin);
searchBtn.addEventListener("click", search);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});

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

//// First way, with API key
async function getMoviesBySearch(movieTitle) {
  const uri = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;
  const response = await fetch(uri);
  const json = await response.json();
  return json;
}

//// Alternative way, with Bearer token
// async function getMoviesBySearch(movieTitle) {
//   const options = {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//       Authorization: `Bearer ${bearerToken}`,
//     },
//   };
//   const uri = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1`;
//   const response = await fetch(uri, options);
//   const json = await response.json();
//   return json;
// }
