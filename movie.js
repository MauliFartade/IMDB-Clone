(function () {
  // Select the HTML elements by their IDs and store them in constants
  const title = document.getElementById("title");
  title.innerHTML = localStorage.getItem("movieName"); // Set the title from local storage
  const year = document.getElementById("year");
  const runtime = document.getElementById("runtime");
  const rating = document.getElementById("rating");
  const poster = document.getElementById("poster");
  const plot = document.getElementById("plot");
  const directorsName = document.getElementById("director-names");
  const castName = document.getElementById("cast-names");
  const genre = document.getElementById("genre");

  // Call the fetchMovies function with the movie title
  fetchMovies(title.innerHTML);

  //asynchronous function used to fetch movie details from the OMDB API
  async function fetchMovies(search) {
    // Construct the API URL with the search parameter (likely the movie title)
    const url = `https://www.omdbapi.com/?t=${search}&type=movie&apikey=28a2ff0`;

    try {
      // Send a request to the OMDB API and wait for the response
      const response = await fetch(url);

      // Convert the response data into a JavaScript object
      const data = await response.json();

      // Populate HTML elements with movie details from the data object
      year.innerHTML = data.Year;
      runtime.innerHTML = data.Runtime;
      rating.innerHTML = `${data.imdbRating}/10`;
      poster.setAttribute("src", `${data.Poster}`);
      plot.innerHTML = data.Plot;
      directorsName.innerHTML = data.Director;
      castName.innerHTML = data.Actors;
      genre.innerHTML = data.Genre;
    } catch (err) {
      // Handle any errors that occur during the fetch or data retrieval
      console.log(err);
    }
  }
})();
