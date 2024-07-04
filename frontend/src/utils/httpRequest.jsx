import axios from "axios";

export const req = axios.create({
    baseURL: `${process.env.REACT_API_URL_BACKEND}`,
    withCredentials: true,
});

export const axiosJWT = axios.create({
    baseURL: `${process.env.REACT_API_URL_BACKEND}`,
    withCredentials: true,
})