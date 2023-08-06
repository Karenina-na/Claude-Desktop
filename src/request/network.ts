import axios from "axios";

const service = axios.create({
    baseURL: (process.env.VITE_NODE_MODE === 'production' ? process.env.VITE_THEMISE_URL + "" : "/api") + "/v1",
    timeout: 5000
});

// Request interceptors
service.interceptors.request.use((config) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return config;
 }, error => {
    return Promise.reject(error);
});

// Response interceptors
service.interceptors.response.use(response => {
    return response.data;
}, error => {
    return Promise.reject(error);
});

export default service;