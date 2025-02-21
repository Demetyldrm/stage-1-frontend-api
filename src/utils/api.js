import axios from "axios";

const baseURL = "http://localhost:3000";

const API_KEY = "c30185551ecb47fea1790dd81917af86";

const newsApiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://nomoreparties.co/news/v2/everything"
    : "https://newsapi.org/v2/everything";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

const newsApiInstance = axios.create({
  baseURL: newsApiBaseUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("jsonwebtoken");
    if (accessToken && config.headers) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

newsApiInstance.interceptors.request.use(
  (config) => {
    if (config.params) {
      config.params.apiKey = API_KEY;
    } else {
      config.params = { apiKey: API_KEY };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance, newsApiInstance };
