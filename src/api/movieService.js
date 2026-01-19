// movieService.js
import axiosInstance from "./axiosInstance";

// ---------------- MOVIES API ----------------

// Get all movies
export const getMovies = async () => {
  const response = await axiosInstance.get("/movies");
  return response.data;
};

// Get a movie by ID
export const getMovieById = async (movieId) => {
  const response = await axiosInstance.get(`/movies/${movieId}`);
  return response.data; // returns movie object
};

// ---------------- THEATERS API ----------------

// Get all theaters
export const getTheaters = async () => {
  const response = await axiosInstance.get("/theaters");
  return response.data;
};

// Get theater by ID
export const getTheaterById = async (theaterId) => {
  const response = await axiosInstance.get(`/theaters/${theaterId}`);
  return response.data.data; // return the theater object
};

// Get screens of a theater by theater ID
export const getScreensByTheaterId = async (theaterId) => {
  const response = await axiosInstance.get(`/theaters/${theaterId}/screens`);
  return response.data; // array of screens
};

// Get screen details by screen ID
export const getScreenDetails = async (screenId) => {
  const response = await axiosInstance.get(`/screens/${screenId}`);
  return response.data.data.screen; // returns screen object
};
