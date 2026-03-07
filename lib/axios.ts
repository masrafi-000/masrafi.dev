import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can perform actions before the request is sent
    // Example: Add a Bearer token if you have authentication
    // const token = localStorage.getItem("token");
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log(`🚀 [Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ [Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError<{ error?: string }>) => {
    // Any status codes outside the range of 2xx trigger this function

    const customError = {
      message: error.response?.data?.error || "An unexpected error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error(
      `❌ [Error Response] ${customError.status}: ${customError.message}`,
    );

    // Global Error Handling Examples:
    if (customError.status === 401) {
      // Logic for unauthorized (e.g., redirect to login)
    }

    if (customError.status === 400) {
      // Logic for validation errors
    }

    return Promise.reject(customError);
  },
);