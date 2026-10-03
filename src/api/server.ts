import axios from "axios";

const server = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  timeout: 30000,
});

export default server;

