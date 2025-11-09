import axios from "axios";

const request = axios.create({
  baseURL: "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com",
});

export default request;
