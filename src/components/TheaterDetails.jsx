import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getTheaterById,
  getScreensByTheaterId,
  getScreenDetails,
  getMovieById,
} from "../api/movieService";
import styles from "./TheaterDetails.module.css";
import AppLayout from "./AppLayout";
import SeatPopup from "./SeatPopup";

function TheaterDetails() {
  const { theaterId } = useParams();
  const navigate = useNavigate();

  const [theater, setTheater] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movies, setMovies] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSeatPopup, setShowSeatPopup] = useState(false);
  // --- CHANGED: Default to 1 ---
  const [seatCount, setSeatCount] = useState(1); 
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    generateDates();
    fetchTheaterData();
  }, []);

  useEffect(() => {
    if (theater) {
      fetchMoviesByDate(selectedDate);
      setSelectedTimes({});
    }
  }, [selectedDate, theater]);

  /* Generate today + next 3 days */
  const generateDates = () => {
    const arr = Array.from({ length: 4 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
    setDates(arr);
  };

  /* Fetch theater info */
  const fetchTheaterData = async () => {
    try {
      const data = await getTheaterById(theaterId);
      setTheater(data);
    } catch {
      setError("Failed to load theater data");
    }
  };

  /* Fetch movies by date */
  const fetchMoviesByDate = async (date) => {
    setLoading(true);
    try {
      const screens = await getScreensByTheaterId(theaterId);
      const screenDetailsArr = await Promise.all(
        screens.map((screen) => getScreenDetails(screen.id))
      );

      const selectedDateStr = date.toISOString().split("T")[0];
      const moviesMap = {};

      for (const screen of screenDetailsArr) {
        if (!screen.showTimes) continue;

        screen.showTimes.forEach((show) => {
          const showDateStr = new Date(show.startTime)
            .toISOString()
            .split("T")[0];

          if (showDateStr === selectedDateStr) {
            if (!moviesMap[show.movieId]) {
              moviesMap[show.movieId] = {
                name: "",
                times: [],
                languages: [],
              };
            }

            moviesMap[show.movieId].times.push({
              showId: show.id,
              time: new Date(show.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          }
        });
      }

      await Promise.all(
        Object.keys(moviesMap).map(async (movieId) => {
          const movieRes = await getMovieById(movieId);
          moviesMap[movieId].name = movieRes.name;
          moviesMap[movieId].languages = movieRes.languages;
        })
      );

      setMovies(Object.values(moviesMap));
    } catch (err) {
      console.error(err);
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  /* Handle time selection */
  const handleTimeSelect = (movieIndex, show) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [movieIndex]: prev[movieIndex]?.showId === show.showId ? null : show,
    }));
  };

  /* --- NEW HANDLER FUNCTION --- */
  const handleConfirmBooking = () => {
    if (bookingInfo && bookingInfo.showId) {
      navigate(`/booking/${bookingInfo.showId}`, {
        state: {
          seatCount: seatCount, // Pass the count here
          // Add any other info you might need on the booking page
          theaterName: theater.name, 
          date: selectedDate
        },
      });
      setShowSeatPopup(false);
    }
  };

  if (error) return <h2>{error}</h2>;
  if (!theater) return <h2>Loading theater...</h2>;

  return (
    <>
      <AppLayout>
        <div className={styles["theater-container"]}>
          {/* Back Button */}
          <button className={styles["back-btn"]} onClick={() => navigate(-1)}>
            ← Back
          </button>

          {/* Theater Info */}
          <h1>{theater.name}</h1>
          <p>{theater.location}</p>

          {/* Date Selection */}
          <div className={styles["date-selection"]}>
            {dates.map((date) => (
              <button
                key={date.toDateString()}
                onClick={() => setSelectedDate(date)}
                className={
                  selectedDate.toDateString() === date.toDateString()
                    ? `${styles["date-btn"]} ${styles.selected}`
                    : styles["date-btn"]
                }
              >
                {formatDate(date)}
              </button>
            ))}
          </div>

          {/* Movies */}
          {loading ? (
            <p>Loading movies...</p>
          ) : movies.length === 0 ? (
            <p>No shows available for this date.</p>
          ) : (
            <div className={styles["movies-list"]}>
              {movies.map((movie, idx) => (
                <div key={idx} className={styles["movie-card"]}>
                  <div>
                    <h3>{movie.name}</h3>

                    {movie.languages?.length > 0 && (
                      <p className={styles["movie-languages"]}>
                        Languages: {movie.languages.join(", ")}
                      </p>
                    )}

                    <div className={styles.showtimes}>
                      {movie.times.map((show) => (
                        <button
                          key={show.showId}
                          className={
                            selectedTimes[idx]?.showId === show.showId
                              ? `${styles.showtime} ${styles["selected-time"]}`
                              : styles.showtime
                          }
                          onClick={() => handleTimeSelect(idx, show)}
                        >
                          {show.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className={styles["book-btn"]}
                    disabled={!selectedTimes[idx]}
                    onClick={() => {
                      setBookingInfo({
                        showId: selectedTimes[idx].showId,
                      });
                      setShowSeatPopup(true);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppLayout>

      {/* SEAT POPUP */}
      <SeatPopup
        visible={showSeatPopup}
        selectedSeats={seatCount}     // State variable
        setSelectedSeats={setSeatCount} // Setter
        onCancel={() => setShowSeatPopup(false)}
        onConfirm={handleConfirmBooking} // New Handler
      />
    </>
  );
}

export default TheaterDetails;