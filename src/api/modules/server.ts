import axios from "axios";

const server = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 30000,
});

export default server;
