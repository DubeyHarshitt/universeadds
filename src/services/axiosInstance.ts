import axios from "axios";
import clearToken from "src/util/clearToken";

export const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_ROOT_URL}`,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    request => {
        console.log(request, 'TOKEN_ReQ');
        const token = localStorage.getItem('token');
        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        }
        return request;
    },
    error => {
        if (error.response && error.response.status === 403) {
            clearToken();
        }
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 403) {
            clearToken();
        }
        return Promise.reject(error);
    }
);