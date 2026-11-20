//API 
//https://www.omdbapi.com/?i=tt3896198&apikey=3fd1110f&s=christopher_nolan
//API
console.log('JavaScript connected')

const API_KEY = '3fd1110f'

const searchForm = document.querySelector('#searchForm')
const searchInput = document.querySelector('#searchInput')
const moviesGrid = document.querySelector('#moviesGrid')
const resultsInfo = document.querySelector('#resultsInfo')
const sortSelect = document.querySelector('#sortSelect')
const loading = document.querySelector('#loading')

let currentMovies = []

//Event Listener
searchForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const searchTerm = searchInput.value.trim()
  if (searchTerm) {  
  fetchMovies(searchTerm)
  }
})
sortSelect.addEventListener('change', () => {
  sortMovies(sortSelect.value)
})

//Fetch movies from API
async function fetchMovies(searchTerm) {
  loading.style.display = 'flex'
  moviesGrid.innerHTML = ''
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`)
  const data = await res.json()
  await new Promise(resolve => setTimeout(resolve, 2000))
  loading.style.display = 'none'
  if (data.Response === 'True') { 
  currentMovies = data.Search
  resultsInfo.textContent = `Showing: ${searchTerm}`
  sortSelect.value = 'default'
  displayMovies(currentMovies)
} else {
  resultsInfo.textContent = `Showing: ${searchTerm}` 
  moviesGrid.innerHTML = '<p>No movies found.</p>'
  currentMovies = []
  }
}

// Diplay movies
function displayMovies(movies) {
  const movieResults = movies.map((movie) => {

    if (!movie.Poster || movie.Poster === 'N/A') {
      return ''
    }

    return `
      <div class="movie-card">
        <img class="movie-card__img"
          src="${movie.Poster}"
          alt="${movie.Title}"
          onerror="this.closest('.movie-card').remove()">
        <h2 class="movie-card__title">${movie.Title}</h2>
        <p class="movie-card__year">${movie.Year}</p>
      </div>
    `
  }).join('')

  moviesGrid.innerHTML = movieResults
}

function sortMovies(filter) {
  const sortedMovies = [...currentMovies]

  if (filter === 'a-z') {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title))
  } else if (filter === 'z-a') {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title))
  } else if (filter === 'newest') {
    sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year))
  } else if (filter === 'oldest') {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year))
  }

  displayMovies(sortedMovies)
}
// Show Skeletons
function showSkeletons() {
  moviesGrid.innerHTML = Array(10).fill('').map(() => {
    return `
      <div class="movie-card">
        <img class="movie-card__img skeleton"
          src="./assets/blurred_nolan.png"
          alt="Loading movie">
        <div class="skeleton skeleton__title"></div>
        <div class="skeleton skeleton__year"></div>
      </div>
    `
  }).join('')
}

// Initial movie search
fetchMovies('Batman, Superman')