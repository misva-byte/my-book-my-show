import { useEffect, useState } from "react";
import MovieCard from "./Moviecard";
import TheaterCard from "./Theater";
import AppLayout from "./AppLayout";
import { getMovies, getTheaters } from "../api/movieService";


function Home() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ showMovies, setShowMovies] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

    const loadData = async () => {
      try {
        const [moviesData, theatersData] = await Promise.all([
          getMovies(),
          getTheaters(),
        ]);
        setMovies(moviesData);
        setTheaters(theatersData.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

console.log(theaters);

  if (loading) return <h2>Loading movies...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <AppLayout>
    <div className="home-container">
      <h2>Now Showing</h2>

{/* buttons */}
      <div className="filter-buttons">
        <button className={ showMovies ? "active" : ""} onClick={() => setShowMovies(true)}>Movies</button>
        <button className={ !showMovies ? "active" : ""} onClick={() => setShowMovies(false)}>Theater</button>
      </div>
    
    {/* Movie & theater card */}
        <div className="movie-grid">
            {showMovies
                ? movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))
                : theaters.length > 0 ? theaters.map((theater) => (
                    <TheaterCard key={theater.id} theater={theater} />
                  ))
                : <p>No theater available</p> }
        </div>

    </div>
    </AppLayout>
  );
}

export default Home;
