import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import {
  FaStar,
  FaSpinner,
  FaMoon,
  FaSun,
  FaGithub,
  FaTimes,
} from "react-icons/fa";

const API_BASE_URL =
  "https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const GENRES_API =
  "https://api.themoviedb.org/3/genre/movie/list?api_key=04c35731a5ee918f014970082a0088b1";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const getMovies = useCallback(() => {
    setLoading(true);
    setError(null);
    const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
    const url = search
      ? `${SEARCHAPI}${search}&sort_by=${sortBy}&page=${page}${genreParam}`
      : `${API_BASE_URL}&sort_by=${sortBy}&page=${page}${genreParam}`;
    axios
      .get(url)
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        setError("Failed to fetch movies.");
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [search, sortBy, page, selectedGenre]);

  useEffect(() => {
    axios
      .get(GENRES_API)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    getMovies();
  }, [getMovies]);


  const changeTheSearch = (event) => {
    setSearch(event.target.value);
  };

  const changeSortBy = (event) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to first page on sort change
  };

  const changeGenre = (event) => {
    setSelectedGenre(event.target.value);
    setPage(1); // Reset to first page on genre change
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  

  return (
    <div
      className={`${darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"
        } min-h-screen flex flex-col`}
    >
      <header
        className={`${darkMode
            ? "bg-gray-800 text-gray-200"
            : "bg-gradient-to-br from-teal-500 to-purple-700"
          } p-4 shadow-md flex items-center justify-between`}
      >
        <h1 className="text-2xl font-bold flex-grow">
          <a
            href="/"
            className={`flex items-center space-x-2 font-semibold ${darkMode
                ? "text-gray-100 hover:text-gray-300"
                : "text-gray-900 hover:text-gray-700"
              } transition-colors duration-300`}
          >
            <span className="text-2xl">🎬</span>{" "}
            <span className="text-2xl">Movie App</span>
          </a>
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-800 text-white"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <a
            href="https://github.com/Laxman965"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div
          className={`${darkMode
              ? "bg-gray-800 text-gray-200"
              : "bg-gradient-to-br from-teal-500 to-purple-700"
            } shadow-2xl rounded-xl p-8 max-w-[1240px] w-full relative`}
        >
          <input
            type="search"
            value={search}
            onChange={changeTheSearch}
            className="w-full border border-gray-200 rounded-lg text-gray-900 p-4 focus:outline-none focus:ring-4 focus:ring-purple-500"
            placeholder="Search for movies..."
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <label className="text-gray-300 mr-2">Sort By:</label>
              <select
                value={sortBy}
                onChange={changeSortBy}
                className="border border-gray-300 rounded-lg p-2 bg-white text-gray-800"
              >
                <option value="popularity.desc">Popularity Descending</option>
                <option value="popularity.asc">Popularity Ascending</option>
                <option value="release_date.desc">
                  Release Date Descending{" "}
                </option>
                <option value="release_date.asc">Release Date Ascending</option>
                <option value="vote_average.desc">Rating Descending</option>
                <option value="vote_average.asc">Rating Ascending</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="text-gray-300 mr-2">Filter By Genre:</label>
              <select
                value={selectedGenre}
                onChange={changeGenre}
                className="border border-gray-300 rounded-lg p-2 bg-white text-gray-800"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loading && (
            <div className="text-center mt-4 text-gray-100">
              <FaSpinner className="animate-spin text-3xl" />
            </div>
          )}
          {error && (
            <div className="text-center mt-4 text-red-500">{error}</div>
          )}
          {movies.length === 0 && !loading && !error ? (
            <div className="text-3xl text-center mt-4 text-gray-100">
              No Movies Found
            </div>
          ) : (
            <div
              className={`mt-8 ${darkMode ? "bg-gray-700" : "bg-gray-300"
                } p-8 rounded-xl shadow-xl`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white"
                      } border border-gray-300 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative cursor-pointer`}
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-between">
                      <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                      <div className="flex justify-between items-center">
                        <span>
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span>{movie.vote_average}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  disabled={page === 1}
                >
                  Previous
                </button>
                <div className="text-gray-200">Page {page}</div>
                <button
                  onClick={() => setPage(page + 1)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {selectedMovie && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div
                className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-white"
                  } rounded-lg p-6 max-w-lg w-full relative`}
              >
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 text-3xl"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>

                <h2 className="text-2xl font-bold mb-4">
                  {selectedMovie.title}
                </h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="w-full h-96 object-cover mb-4"
                />
                <p>
                  <strong>Release Date:</strong>{" "}
                  {new Date(selectedMovie.release_date).toDateString()}
                </p>
                <p>
                  <strong>Overview:</strong> {selectedMovie.overview}
                </p>
                <p>
                  <strong>Rating:</strong> {selectedMovie.vote_average}
                </p>
                <p>
                  <strong>Genres:</strong>{" "}
                  {selectedMovie.genre_ids
                    .map((id) => genres.find((genre) => genre.id === id)?.name)
                    .join(", ")}
                </p>
                {/* Add trailer or more details here */}
              </div>
            </div>
          )}
        </div>
      </main>
      <footer
        className={`${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-900 text-gray-200"
          } py-6 text-center`}
      >
        <div className="max-w-[1240px] mx-auto flex flex-col items-center">
          <p className="mb-4">
            Built with creativity by Laxman. Exploring movies and code together.
          </p>
          <a
            href="https://github.com/Laxman965"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 hover:text-gray-300 ${darkMode
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-700 hover:text-gray-500"
              }`}
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
