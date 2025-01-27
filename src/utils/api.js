import axios from "axios";

const baseURL = "http://localhost:3000"; // Backend URL
// const newsApiBaseURL = "https://newsapi.org/v2/everything";
const API_KEY = "c30185551ecb47fea1790dd81917af86";

const newsApiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://nomoreparties.co/news/v2/everything"
    : "https://newsapi.org/v2/everything";

//  axios instance for backend
const axiosInstance = axios.create({
  baseURL: baseURL,
});

//  axios instance for newsapi
const newsApiInstance = axios.create({
  baseURL: newsApiBaseUrl,
});

// Request interceptor (backend)
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

// Request interceptor (NewsAPI)
newsApiInstance.interceptors.request.use(
  (config) => {
    // API Key
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

// import axios from "axios";

// // Backend Base URL
// const baseURL =
//   process.env.NODE_ENV === "production"
//     ? "https://your-production-backend.com"
//     : "http://localhost:3000";

// // NewsAPI Key from environment variables
// const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

// // Axios instance for Backend
// const axiosInstance = axios.create({
//   baseURL: baseURL,
// });

// // Request interceptor for Backend
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const accessToken = localStorage.getItem("jsonwebtoken");
//     if (accessToken && config.headers) {
//       config.headers.Authorization = accessToken;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Request interceptor for NewsAPI
// newsApiInstance.interceptors.request.use(
//   (config) => {
//     // Append API Key to params
//     if (config.params) {
//       config.params.apiKey = API_KEY;
//     } else {
//       config.params = { apiKey: API_KEY };
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// newsApiInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (process.env.NODE_ENV === "production") {
//       console.error("Error in production:", error.message);
//     } else {
//       console.error("Error in development:", error);
//     }
//     return Promise.reject(error);
//   }
// );

// export { axiosInstance, newsApiInstance };
