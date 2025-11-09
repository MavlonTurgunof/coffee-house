import axios from "axios";

const request = axios.create({
  baseURL: "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com",
  headers: { "Content-Type": "application/json" },
});

request.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("access_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export default request;
