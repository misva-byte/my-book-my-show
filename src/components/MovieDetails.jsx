import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import axiosInstance from "../api/axiosInstance";
import SeatPopup from "./SeatPopup";
import "./MovieDetails.css";

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [showTimes, setShowTimes] = useState([]);

  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  const [showSeatPopup, setShowSeatPopup] = useState(false);
  const [seatCount, setSeatCount] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- UTILS ---------------- */

  const normalizeDate = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };

  const isWithinNextThreeDays = (dateString) => {
    const diff =
      (normalizeDate(dateString) - normalizeDate(new Date())) /
      (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  };

  /* ---------------- LOAD MOVIE ---------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axiosInstance.get(`/movies/${movieId}`);
        setMovie(res.data);
        setTheaters(res.data.theaters || []);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [movieId]);

  /* ---------------- THEATER CLICK ---------------- */

  const handleTheaterClick = async (theater) => {
    setSelectedTheater(theater);
    setSelectedDate(null);
    setSelectedShow(null);
    setShowTimes([]);

    const screensRes = await axiosInstance.get(
      `/theaters/${theater.id}/screens`
    );

    let allShows = [];

    for (const screen of screensRes.data) {
      const res = await axiosInstance.get(`/screens/${screen.id}`);
      const shows =
        res.data?.data?.screen?.showTimes?.filter(
          (s) => s.movieId === movieId
        ) || [];
      allShows.push(...shows);
    }

    const filtered = allShows
      .filter((s) => isWithinNextThreeDays(s.startTime))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    const unique = Array.from(
      new Map(
        filtered.map((s) => [new Date(s.startTime).getTime(), s])
      ).values()
    );

    setShowTimes(unique);
  };

  /* ---------------- DERIVED DATA ---------------- */

  const uniqueDates = [
    ...new Map(
      showTimes.map((s) => {
        const d = new Date(s.startTime);
        d.setHours(0, 0, 0, 0);
        return [d.getTime(), d];
      })
    ).values(),
  ];

  const timesForSelectedDate = selectedDate
    ? showTimes.filter(
        (s) =>
          normalizeDate(s.startTime) === normalizeDate(selectedDate)
      )
    : [];

  
  /* ---------------- HANDLER FUNCTION ---------------- */
  
  const handleConfirmBooking = () => {
    setShowSeatPopup(false);
    
    // Check if a show is selected before navigating (safety check)
    if (selectedShow) {
      navigate(`/booking/${selectedShow.id}`, {
        state: {
          seatCount: seatCount, // This is the value used by BookingPage.jsx
          
          // Optional: Pass other details if needed for display
          movieName: movie?.name,
          theaterName: selectedTheater?.name
        },
      });
    }
  };

  /* ---------------- RENDER ---------------- */

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <>
      <AppLayout>
        <div className={`movie-details wrapper ${showSeatPopup ? "blurred" : ""}`}>
          <button className="back-button" onClick={() => navigate("/home")}>
            ← Back
          </button>

          <div className="movie-details-page">
            {/* LEFT */}
            <div className="movie-left">
              {/* THEATER */}
              <div className="section">
                <h3>Theater</h3>
                {theaters.map((t) => (
                  <button
                    key={t.id}
                    className={`theater-btn ${
                      selectedTheater?.id === t.id ? "selected" : ""
                    }`}
                    onClick={() => handleTheaterClick(t)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {/* DATE */}
              <div className="section">
                <h3>Date</h3>
                {uniqueDates.map((d) => (
                  <button
                    key={d.getTime()}
                    className={`date-btn ${
                      normalizeDate(selectedDate) === d.getTime()
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedShow(null);
                    }}
                  >
                    <div>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div>
                      {d.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  </button>
                ))}
              </div>

              {/* TIME */}
              <div className="section">
                <h3>Time</h3>
                {timesForSelectedDate.map((s) => (
                  <button
                    key={s.id}
                    className={`time-btn ${
                      selectedShow?.id === s.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedShow(s)}
                  >
                    {new Date(s.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="movie-right">
              <div className="movie-details-card">
                <img src={movie.image} alt={movie.name} />
                <div className="movie-info">
                  <h3>{movie.name}</h3>
                  <p className="description">{movie.description}</p>
                  <div className="movie-meta">
                    <p><strong>Duration:</strong> {movie.duration} mins</p>
                    <p><strong>Language:</strong> {" "}{movie.languages?.join(", ")}</p>
                    <p><strong>Category:</strong> {movie.category?.join(", ")}</p>
                  </div>
                </div>
              </div>

            {/* Booking card */}
              {selectedTheater && selectedShow && (
                <div className="booking-card">
                  <h3>{selectedTheater.name}</h3>
                  <p>{new Date(selectedShow.startTime).toDateString()}</p>
                  <p>
                    {new Date(selectedShow.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <button className="book-now-btn" onClick={() => setShowSeatPopup(true)}>
                    Book Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppLayout>

      {/* SEAT POPUP */}
      <SeatPopup
        visible={showSeatPopup}
        selectedSeats={seatCount}
        setSelectedSeats={setSeatCount}
        onCancel={() => setShowSeatPopup(false)}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
}

export default MovieDetails;
