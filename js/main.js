 let elWrapper = document.querySelector("#wrapper");
 let elForm = document.querySelector("#form");
 let elSearchInput = document.querySelector("#search_input");
 let elMovieModal = document.querySelector(".movie-modal");
 let elRating = document.querySelector("#rating");
 let elCategory = document.querySelector("#category-select");
 let elBtn = document.querySelector("#btn");
 let elBookmarkedList = document.querySelector(".bokmarked-list")
 let elTitle = document.querySelector("#search-result");
 let elTemplate = document.querySelector("#template").content;
 let elBookmarkTemplate = document.querySelector("#bookmarked").content;
 
 
 
 
 
 // Get movies list 
 let slicedMovies = movies.slice(0, 10)
 
 let normolizedMovieList = slicedMovies.map((movieItem, index) => {
    
    return {
        id: index + 1,
        title: movieItem.Title.toString(),
        categories: movieItem.Categories,
        summary: movieItem.summary,
        rating: movieItem.imdb_rating,
        year: movieItem.movie_year,
        imageLink: `https://i.ytimg.com/vi/${movieItem.ytid}/mqdefault.jpg`,
        youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`  
    } 
    
})



// -----------------------------------------------------------------------------

// create categories

function generateCategories(movieArray) {
    let categoryList = []
    
    
    movieArray.forEach(function (item) {
        let splittedCategorys = item.categories.split("|")
        
        splittedCategorys.forEach(function (item) {
            
            if (!categoryList.includes(item)) {
                categoryList.push(item)
                
            }
            
        })
        
    })
    
    categoryList.sort()
    
    let categoryFragment = document.createDocumentFragment()
    categoryList.forEach(function (item) {
        
        let caregoryOption = document.createElement("option")
        caregoryOption.value = item
        caregoryOption.textContent = item
        
        categoryFragment.appendChild(caregoryOption)
    })
    
    elCategory.appendChild(categoryFragment)
    
}

generateCategories(normolizedMovieList)



// ---------------------------------------------------------------------------


// Create render function

function renderMovies(movieArray, wrapper) {
    wrapper.innerHTML = null;
    let elFragment = document.createDocumentFragment()
    
    movieArray.forEach(movie => {
        let templateDiv = elTemplate.cloneNode(true)
        
        templateDiv.querySelector(".card-img-top").src = movie.imageLink
        templateDiv.querySelector(".card-title").textContent = movie.title
        templateDiv.querySelector(".card-categories").textContent = movie.categories.split("|").join(" ")
        templateDiv.querySelector(".card-year").textContent = movie.year
        templateDiv.querySelector(".card-rate").textContent = movie.rating
        templateDiv.querySelector(".card-link").href = movie.youtubeLink
        templateDiv.querySelector(".modal-open-btn").dataset.movieIdformodal = movie.id
        templateDiv.querySelector(".bookmark-btn").dataset.movieId = movie.id

        
        
        elFragment.appendChild(templateDiv)
        
    });
    
    
    
    wrapper.appendChild(elFragment)
    
    elTitle.textContent = movieArray.length;
    
}

renderMovies(normolizedMovieList, elWrapper);





// ----------------------------------------------------------------------------------------




let findMovies = function (movie_title, minRaitng, genre) {
    return normolizedMovieList.filter(function (movie) {
        let doesMatchCategory = genre === "All" || movie.categories.split("|").includes(genre);
        return movie.title.match(movie_title) && movie.rating >= minRaitng && doesMatchCategory ;   
    })
}



elForm.addEventListener("submit", function (evt) {
    evt.preventDefault()
    
    let searchInput = elSearchInput.value.trim()
    let ratingInput = elRating.value.trim()
    let selectOption = elCategory.value
    
    
    let pattern  =new RegExp(searchInput, "gi")
    let resultArray = findMovies(pattern , ratingInput, selectOption)
    
    
    renderMovies(resultArray , elWrapper);
    
})

// -----------------------------------------------------------------------------------------


let storage = window.localStorage

// storage.setItem("salom", JSON.stringify(someObject))


// console.log(JSON.parse(storage.getItem("salom")));
let getItemFormLocalStorage = JSON.parse(storage.getItem("movieArray"))

let bookmarkedMovies = getItemFormLocalStorage || []
// if (getItemFormLocalStorage) {

//     bookmarkedMovies = getItemFormLocalStorage

// }else{
//      bookmarkedMovies = []
// }




elWrapper.addEventListener("click", function(evt) {
    
    let movieId = evt.target.dataset.movieId;
    
    if (movieId) {
        
        let foundMovie =  normolizedMovieList.find(function (item) {
            return item.id == movieId
        })
        
        
        let doesInclute = bookmarkedMovies.findIndex(function (item) {
            return item.id === foundMovie.id
            
        })
        
        if (doesInclute === -1) {
            bookmarkedMovies.push(foundMovie)
            storage.setItem("movieArray",JSON.stringify(bookmarkedMovies))
            console.log(bookmarkedMovies);
        }
        renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)
        
        
    }
    
    
})


// render bookmarked movies 

function renderBookmarkedMovies(array, wrapper) {
    
    wrapper.innerHTML = null;
    let elFragment = document.createDocumentFragment()
    
    array.forEach(function (item) {
        let templateBookmark = elBookmarkTemplate.cloneNode(true)
        
        templateBookmark.querySelector(".movie-title").textContent = item.title
        templateBookmark.querySelector(".btn-remove").dataset.markedId = item.id
        
        elFragment.appendChild(templateBookmark)
        
    })
    
    wrapper.appendChild(elFragment)
}

renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)


elBookmarkedList.addEventListener("click", function (evt) {
    let removedMovieId = evt.target.dataset.markedId; 
    
    
    if (removedMovieId) {
        let indexOfmovies =  bookmarkedMovies.findIndex(function (item) {
            return item.id == removedMovieId
        })
        
        bookmarkedMovies.splice(indexOfmovies,1)
        storage.setItem("movieArray",JSON.stringify(bookmarkedMovies))
        renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)
        
        
    }
    
    
    
})


// --------------------------------------------------------------------------

elWrapper.addEventListener("click", function (evt) {
    
    let moreInfoBtn = evt.target.dataset.movieIdformodal

    if (moreInfoBtn) {
        
        let findMovie =  normolizedMovieList.find(function (item) {
            return item.id == moreInfoBtn
        })

        console.log(findMovie);
       elMovieModal.querySelector(".movie-modal-heading").textContent = findMovie.title
       elMovieModal.querySelector(".movie-modal-text").textContent = findMovie.summary


    }   
})