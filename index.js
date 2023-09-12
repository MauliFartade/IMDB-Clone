// This code is wrapped in a self-invoking function to create a private scope.
(function () {
    // Get references to various HTML elements using their IDs.
    const searchKeyword = document.getElementById("search");
    const suggestionsContainer = document.getElementById("card-container");
    const favMoviesContainer = document.getElementById("fav-movies-container");
    const containerImg = document.getElementById("Suggestions-container-img");
    const showFavourites = document.getElementById("favorites-section");
    const emptyFavText = document.getElementById("empty-fav-text");
  
    // Call the addToFavDOM() function.
    addToFavDOM();  //This ensures that when the web page initially loads or when a user revisits the page, their list of favorite movies is displayed.
  
    // Call the showEmptyText() function.
    showEmptyText(); 
  
    // Declare two arrays, suggestionList and favMovieArray.
    let suggestionList = [];  // is used to store search result suggestions,
    let favMovieArray = [];   // is used to store the user's favorite movies
  
    // Add an event listener for the "keydown" event on the searchKeyword element.
    searchKeyword.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
        event.preventDefault();
      }
    });
  
    // this  function checks whether the favorites container is empty. If it's empty, it displays an empty text message; otherwise, it hides the message.
    function showEmptyText() {
      
      if (favMoviesContainer.innerHTML == "") {
        emptyFavText.style.display = "block"; //This makes the empty text message visible on the web page
      } else {
        emptyFavText.style.display = "none"; // This hides the empty text message
      }
    }
  
    // Add an event listener for the "keyup" event on the searchKeyword element.
    searchKeyword.addEventListener("keyup", function () {
      // Get the search value from the input field.
      let search = searchKeyword.value; 
  
      // Check if the search is empty.
      if (search === "") {
        containerImg.style.display = "block";
        suggestionsContainer.innerHTML = ""; //previously displayed movie suggestions are removed from the container
        suggestionList = [];  //Reset the suggestionList array to an empty array.
      } else {
        containerImg.style.display = "none";
  
        // Use an async function to fetch movie data based on the search.
        (async () => {
          let data = await fetchMovies(search);
          addToSuggestionContainerDOM(data);
        })();
  
        suggestionsContainer.style.display = "grid";
      }
    });
  
    // Define an async function to fetch movie data from an API.
    async function fetchMovies(search) {
      const url = `https://www.omdbapi.com/?t=${search}&apikey=28a2ff0`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    }
  
    // this function is used to add movie data to the suggestion container in the DOM.
    function addToSuggestionContainerDOM(data) {
      document.getElementById("empty-fav-text").style.display = "none"; //Hide the empty favorites text message.
      let isPresent = false; //is used to track whether a movie with the same title as the data object is already present in the suggestionList.
  
      // Check if the movie is already present in the suggestionList array to avoid duplicates with the help of forEach loop
      suggestionList.forEach((movie) => {
        if (movie.Title == data.Title) {   //it's comparing the titles of two movies.current movie & Title property of the data object 
          isPresent = true; // indicate that a duplicate movie has been found. 
        }
      });
  
      if (!isPresent && data.Title != undefined) { // This line ensures that a movie is added to the suggestions list if it has a defined title and is not already a duplicate in the list.
        if (data.Poster == "N/A") { 
          data.Poster = "";
        }
        suggestionList.push(data); //, it adds the movie data to the array.
        const movieCard = document.createElement("div"); //It creates a new div, represent the movie card.
        movieCard.setAttribute("class", "text-decoration");
  
        // Create movie card and append it to suggestionsContainer.
        movieCard.innerHTML = `
          <div class="card my-2" data-id="${data.Title}">
            <a href="movie.html">
              <img
                src="${data.Poster}"
                class="card-img-top"
                alt="..."
                data-id="${data.Title}"
              />
              <div class="card-body text-start">
                <h5 class="card-title">
                  <a href="movie.html" data-id="${data.Title}">${data.Title}</a>
                </h5>
                <p class="card-text">
                  <i class="fa-solid fa-star">
                    <span id="rating">&nbsp;${data.imdbRating}</span>
                  </i>
                  <button class="fav-btn">
                    <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
                  </button>
                </p>
              </div>
            </a>
          </div>
        `;//It creates a card structure with an image, title, rating, and favorites button.

        suggestionsContainer.prepend(movieCard); //displaying the newly added movie at the top.
      }
    }
  
    
    //async function to handle adding movies to favorites.
    async function handleFavBtn(e) {
      const target = e.target;
  
      // Fetch movie data based on the dataset ID.
      let data = await fetchMovies(target.dataset.id);
  
      let favMoviesLocal = localStorage.getItem("favMoviesList");
  
      if (favMoviesLocal) { //// If there are favorite movies in local storage, convert them to an array.
        favMovieArray = Array.from(JSON.parse(favMoviesLocal)); 
      } else { //no favorite movies in local storage, initialize favMovieArray with the current movie data.
        localStorage.setItem("favMoviesList", JSON.stringify(data));
      }
  
      //if the movie is already present in the fav list.
      let isPresent = false;
      favMovieArray.forEach((movie) => {
        if (data.Title == movie.Title) {
          notify("Already added to the fav list"); //If the movie is already in the favorites list, display a notification.
          isPresent = true;
        }
      });
  
      if (!isPresent) { // If the movie is not already in the favorites list, add it.
        favMovieArray.push(data);
      }
  
      // Update the local storage with the updated favMovieArray.
      localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
      isPresent = !isPresent;
  
      // Call the addToFavDOM() function to update the favorites list in the DOM.
      addToFavDOM();
    }
  
    //function used to add movies to the favorites list in the DOM.
    function addToFavDOM() {
      favMoviesContainer.innerHTML = ""; // Clear the current content
      
      //fetch the list of favorite movies from local storage and parse it as an array.
      let favList = JSON.parse(localStorage.getItem("favMoviesList"));
      if (favList) { //if there are favorite movies in local storage.
        favList.forEach((movie) => {
          const div = document.createElement("div"); // Create a new div for movie card.
          div.classList.add( //CSS classes to the div 
            "fav-movie-card",
            "d-flex",
            "justify-content-between",
            "align-content-center",
            "my-2"
          );
          //HTML content for the movie card
          div.innerHTML = `
            <img
              src="${movie.Poster}"
              alt=""
              class="fav-movie-poster"
            />
            <div class="movie-card-details">
              <p class="movie-name mt-3 mb-0">
                <a href="movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}</a>
              </p>
              <small class="text-muted">${movie.Year}</small>
            </div>
            <div class="delete-btn my-4">
              <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
            </div>
          `;
  
          // Append the div to the favMoviesContainer
          favMoviesContainer.prepend(div);
        });
      }
    }
  
    // To notify browser alert
    function notify(text) {
      window.alert(text);
    }
  
    // Delete from favorite list
    function deleteMovie(name) {
      let favList = JSON.parse(localStorage.getItem("favMoviesList")); //list of favorite movies is store in the favList variable.
      let updatedList = Array.from(favList).filter((movie) => {
        return movie.Title != name;
      }); //remove movie from the list.title matches the provided name
  
      localStorage.setItem("favMoviesList", JSON.stringify(updatedList));
  
      addToFavDOM();
      showEmptyText();
    }
  
    // Handles click events
    async function handleClickListner(e) {
      const target = e.target;
  
      if (target.classList.contains("add-fav")) {
        e.preventDefault();
        handleFavBtn(e);
      } else if (target.classList.contains("fa-trash-can")) {
        deleteMovie(target.dataset.id);
      } else if (target.classList.contains("fa-bars")) {
        if (showFavourites.style.display == "flex") {
          document.getElementById("show-favourites").style.color = "#8b9595";
          showFavourites.style.display = "none";
        } else {
          showFavourites.classList.add("");
          document.getElementById("show-favourites").style.color = "var(--logo-color)";
          showFavourites.style.display = "flex";
        }
      }
  
      localStorage.setItem("movieName", target.dataset.id);
    }
  
    // Event listener on the whole document
    document.addEventListener("click", handleClickListner);
  })();
  