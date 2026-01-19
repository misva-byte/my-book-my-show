import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {

  const navigate = useNavigate();

  return (
    <div 
    className="movie-card" 
    onClick={() => navigate(`/movie/${movie.id}`)}>
  
      <img src={movie.image} 
       alt={movie.name} />
      <h4>{movie.name}</h4>
    </div>
  );
}

export default MovieCard;
