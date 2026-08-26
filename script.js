const API_BASE_URL = "https://www.omdbapi.com/";

const PLACEHOLDER_IMAGE =
    "https://via.placeholder.com/500x750?text=No+Poster";


// --------------------------------------------------
// DOM ELEMENTS
// --------------------------------------------------

const searchForm =
    document.getElementById("searchForm");

const searchInput =
    document.getElementById("searchInput");

const movieGrid =
    document.getElementById("movieGrid");

const statusElement =
    document.getElementById("status");

const resultCount =
    document.getElementById("resultCount");

const resultsTitle =
    document.getElementById("resultsTitle");

const movieModal =
    document.getElementById("movieModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const closeModalButton =
    document.getElementById("closeModal");

const movieDetails =
    document.getElementById("movieDetails");


// --------------------------------------------------
// CACHE
// --------------------------------------------------

const CACHE_KEY = "cinesearch_omdb_cache";

const CACHE_DURATION =
    1000 * 60 * 30;


// --------------------------------------------------
// CACHE HELPERS
// --------------------------------------------------

function getCache() {

    try {

        const cache =
            localStorage.getItem(CACHE_KEY);

        return cache
            ? JSON.parse(cache)
            : {};

    } catch (error) {

        console.error(
            "Cache read error:",
            error
        );

        return {};
    }
}


function saveCache(cache) {

    try {

        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(cache)
        );

    } catch (error) {

        console.error(
            "Cache save error:",
            error
        );
    }
}


function getCachedSearch(query) {

    const cache = getCache();

    const item = cache[query];

    if (!item) {
        return null;
    }


    const expired =
        Date.now() - item.timestamp >
        CACHE_DURATION;


    if (expired) {

        delete cache[query];

        saveCache(cache);

        return null;
    }


    return item.results;
}


function cacheSearch(query, results) {

    const cache = getCache();

    cache[query] = {
        timestamp: Date.now(),
        results: results
    };

    saveCache(cache);
}


// --------------------------------------------------
// UI HELPERS
// --------------------------------------------------

function showStatus(
    message,
    type = ""
) {

    statusElement.textContent =
        message;

    statusElement.className =
        `status ${type}`;
}


function showLoading() {

    statusElement.innerHTML =
        `<div class="loader"></div>`;

    statusElement.className =
        "status";
}


function clearResults() {

    movieGrid.innerHTML = "";

    resultCount.textContent = "";
}


function showEmptyState(
    title,
    message
) {

    movieGrid.innerHTML = `
        <div class="empty-state">

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;
}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// --------------------------------------------------
// SEARCH MOVIES
// --------------------------------------------------

async function searchMovies(query) {

    const normalizedQuery =
        query.trim().toLowerCase();


    if (!normalizedQuery) {

        clearResults();

        resultsTitle.textContent =
            "Search Results";

        showStatus("");

        showEmptyState(
            "Search for a movie",
            "Enter a movie title above to get started."
        );

        return;
    }


    // Check cache first

    const cachedResults =
        getCachedSearch(normalizedQuery);


    if (cachedResults) {

        console.log(
            "Using cached results for:",
            normalizedQuery
        );

        renderMovies(cachedResults);

        showStatus(
            "Results loaded from cache.",
            "success"
        );

        return;
    }


    showLoading();

    clearResults();

    resultsTitle.textContent =
        `Results for "${query}"`;


    try {

        const url =
            `${API_BASE_URL}?apikey=${encodeURIComponent(OMDB_API_KEY)}` +
            `&s=${encodeURIComponent(query)}` +
            `&type=movie`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );
        }


        const data =
            await response.json();


        if (data.Response === "False") {

            throw new Error(
                data.Error ||
                "No movies found."
            );
        }


        const movies =
            data.Search || [];


        cacheSearch(
            normalizedQuery,
            movies
        );


        renderMovies(movies);


        showStatus(
            `${data.totalResults || movies.length} movie(s) found.`,
            "success"
        );


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        clearResults();

        showStatus(
            error.message ||
            "Unable to search movies.",
            "error"
        );


        showEmptyState(
            "No results",
            "Try another movie title."
        );
    }
}


// --------------------------------------------------
// RENDER MOVIES
// --------------------------------------------------

function renderMovies(movies) {

    clearResults();


    if (!movies.length) {

        showEmptyState(
            "No movies found",
            "Try another search."
        );

        return;
    }


    resultCount.textContent =
        `${movies.length} result(s)`;


    movies.forEach(movie => {

        const card =
            createMovieCard(movie);

        movieGrid.appendChild(card);
    });
}


// --------------------------------------------------
// MOVIE CARD
// --------------------------------------------------

function createMovieCard(movie) {

    const card =
        document.createElement("article");

    card.className =
        "movie-card";


    const poster =
        movie.Poster &&
        movie.Poster !== "N/A"
            ? movie.Poster
            : PLACEHOLDER_IMAGE;


    card.innerHTML = `

        <div class="poster-container">

            <img
                class="poster"
                src="${poster}"
                alt="${escapeHTML(movie.Title)} poster"
                loading="lazy"
            >

        </div>


        <div class="movie-info">

            <h3 class="movie-title">
                ${escapeHTML(movie.Title)}
            </h3>


            <div class="movie-meta">

                <span>
                    ${escapeHTML(movie.Year || "N/A")}
                </span>

                <span>
                    🎬 ${escapeHTML(movie.Type || "Movie")}
                </span>

            </div>


            <button
                class="details-button"
                type="button"
            >
                View Details
            </button>

        </div>
    `;


    const image =
        card.querySelector(".poster");


    image.addEventListener(
        "error",
        () => {

            image.src =
                PLACEHOLDER_IMAGE;
        }
    );


    const detailsButton =
        card.querySelector(
            ".details-button"
        );


    detailsButton.addEventListener(
        "click",
        () => {

            openMovieDetails(
                movie.imdbID
            );
        }
    );


    return card;
}


// --------------------------------------------------
// MOVIE DETAILS
// --------------------------------------------------

async function openMovieDetails(
    imdbID
) {

    movieModal.classList.remove(
        "hidden"
    );


    movieModal.setAttribute(
        "aria-hidden",
        "false"
    );


    movieDetails.innerHTML =
        `<div class="loader"></div>`;


    try {

        const url =
            `${API_BASE_URL}?apikey=${encodeURIComponent(OMDB_API_KEY)}` +
            `&i=${encodeURIComponent(imdbID)}` +
            `&plot=full`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );
        }


        const movie =
            await response.json();


        if (movie.Response === "False") {

            throw new Error(
                movie.Error ||
                "Movie details unavailable."
            );
        }


        renderMovieDetails(movie);


    } catch (error) {

        console.error(
            "Details error:",
            error
        );


        movieDetails.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to load details
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Please try again."
                    )}
                </p>

            </div>
        `;
    }
}


// --------------------------------------------------
// RENDER DETAILS
// --------------------------------------------------

function renderMovieDetails(movie) {

    const poster =
        movie.Poster &&
        movie.Poster !== "N/A"
            ? movie.Poster
            : PLACEHOLDER_IMAGE;


    movieDetails.innerHTML = `

        <div class="details-layout">

            <div>

                <img
                    class="details-poster"
                    src="${poster}"
                    alt="${escapeHTML(movie.Title)} poster"
                >

            </div>


            <div class="details-info">

                <h2 id="modalTitle">
                    ${escapeHTML(movie.Title)}
                </h2>


                <ul class="detail-list">

                    <li>
                        <strong>Year:</strong>
                        ${escapeHTML(movie.Year || "N/A")}
                    </li>

                    <li>
                        <strong>Released:</strong>
                        ${escapeHTML(movie.Released || "N/A")}
                    </li>

                    <li>
                        <strong>Genre:</strong>
                        ${escapeHTML(movie.Genre || "N/A")}
                    </li>

                    <li>
                        <strong>Director:</strong>
                        ${escapeHTML(movie.Director || "N/A")}
                    </li>

                    <li>
                        <strong>Actors:</strong>
                        ${escapeHTML(movie.Actors || "N/A")}
                    </li>

                    <li>
                        <strong>Runtime:</strong>
                        ${escapeHTML(movie.Runtime || "N/A")}
                    </li>

                    <li>
                        <strong>IMDb Rating:</strong>
                        ⭐ ${escapeHTML(movie.imdbRating || "N/A")}
                    </li>

                </ul>


                <p class="details-description">

                    ${escapeHTML(
                        movie.Plot ||
                        "No description available."
                    )}

                </p>

            </div>

        </div>
    `;


    const image =
        movieDetails.querySelector(
            ".details-poster"
        );


    image.addEventListener(
        "error",
        () => {

            image.src =
                PLACEHOLDER_IMAGE;
        }
    );
}


// --------------------------------------------------
// MODAL
// --------------------------------------------------

function closeModal() {

    movieModal.classList.add(
        "hidden"
    );

    movieModal.setAttribute(
        "aria-hidden",
        "true"
    );

    movieDetails.innerHTML = "";
}


closeModalButton.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    closeModal
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !movieModal.classList.contains("hidden")
        ) {

            closeModal();
        }
    }
);


// --------------------------------------------------
// DEBOUNCE
// --------------------------------------------------

function debounce(
    callback,
    delay
) {

    let timeoutId;


    return function (...args) {

        clearTimeout(timeoutId);


        timeoutId =
            setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );
    };
}


const debouncedSearch =
    debounce(
        searchMovies,
        500
    );


// --------------------------------------------------
// SEARCH EVENTS
// --------------------------------------------------

searchInput.addEventListener(
    "input",
    event => {

        const query =
            event.target.value.trim();


        if (!query) {

            clearResults();

            showStatus("");

            resultsTitle.textContent =
                "Search Results";

            showEmptyState(
                "Search for a movie",
                "Enter a movie title above to get started."
            );

            return;
        }


        debouncedSearch(query);
    }
);


searchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const query =
            searchInput.value.trim();


        if (query) {

            searchMovies(query);
        }
    }
);


// --------------------------------------------------
// INITIAL STATE
// --------------------------------------------------

showEmptyState(
    "Search for a movie",
    "Enter a movie title above to get started."
);