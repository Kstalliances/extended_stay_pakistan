import axios from "axios";
import {getToken} from "../service/userservice";


// const BASE_URL = "https://plum-anxious-eel.cyclic.app/api/room-book";
const BASE_URL = "http://localhost:4000/api/room-book/v1";

export const myAxios = axios.create({
    baseURL: BASE_URL,
});

export const privateAxios = axios.create({
    baseURL: BASE_URL,
});

privateAxios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `${token}`;
            return config;
        }
    },
    (error) => Promise.reject(error)
);
