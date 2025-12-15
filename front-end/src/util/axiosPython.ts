import axios from "axios";

const axiosPython = axios.create({
  baseURL: "http://localhost:8000", // Python FastAPI backend
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosPython;
