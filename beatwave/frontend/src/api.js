import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// You can export axios instance (optional)
const api = axios.create({
  baseURL: API_URL,
});

export default api;

// OR export base URL if you prefer using axios directly
export { API_URL };
