import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3000/api",
  headers: new Headers({
    "Content-type": "application/json",
    Accept: 'application/json'
  })
});