import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: new Headers({
    "Content-type": "application/json",
    Accept: 'application/json'
  })
});