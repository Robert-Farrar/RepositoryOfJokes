import axios from 'axios';
import {getAuth} from '../Models/Auth';

const axiosClient = axios.create({baseURL: 'http://localhost:5118', headers: {'Content-Type': 'application/json',},});

axiosClient.interceptors.request.use(
    (config) => {
        const {token} = getAuth();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;