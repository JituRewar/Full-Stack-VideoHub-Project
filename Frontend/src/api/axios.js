import axios from "axios"

export const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("Unauthorized - user not logged in")
    }
    return Promise.reject(err)
  }
)