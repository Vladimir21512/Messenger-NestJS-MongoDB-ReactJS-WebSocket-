import axios from 'axios';
import {LOGIN_ROUTE} from "../router/path";
import {useContext} from "react";
import {Context} from "../index";

export const API_URL = 'http://localhost:5000'

const $host = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
})

const $authHost = axios.create({
    withCredentials:true,
    baseURL: process.env.REACT_APP_SERVER_URL
})

const $authHostWithoutBodyChange = axios.create({
    withCredentials:true,
    baseURL: process.env.REACT_APP_SERVER_URL
})

const $refreshHost = axios.create({
    withCredentials:true,
    baseURL: process.env.REACT_APP_SERVER_URL
})



// const authInterceptor = config => {
//     config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
//     return config
// }
// $authHost.interceptors.request.use(authInterceptor)

$refreshHost.interceptors.response.use(async (config) => {
    if(config.data?.message=='Unauthorized'){
        const originalRequest=config.config
            try {
                const response = await axios.get(`${API_URL}/user/refresh`, {withCredentials: true})
                if (response.data.message) {
                    return 'invalid token'
                } else {
                    localStorage.setItem('token', response.data.accessToken);
                }
                return $authHost.post(`${API_URL}/user/check`, {accessToken:response.data.accessToken}, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
            } catch (e) {
                return e
            }

    }
    return config;
},async (error) => {
    console.log(error)
    // const originalRequest = error.config;
    // if (error.response.status == 401 && error.config && !error.config._isRetry) {
    //     originalRequest._isRetry = true;
    //     try {
    //         const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
    //         localStorage.setItem('token', response.data.accessToken);
    //         return $api.request(originalRequest);
    //     } catch (e) {
    //         console.log('НЕ АВТОРИЗОВАН')
    //     }
    // }
    // throw error;
})


$authHost.interceptors.response.use(async (config) => {
    if(config.data?.message=='Unauthorized'){
        const originalRequest=config.config
        try {
            const response = await axios.get(`${API_URL}/user/refresh`, {withCredentials: true})
            if (response.data.message) {
                return 'invalid token'
            } else {
                localStorage.setItem('token', response.data.accessToken);
            }
            originalRequest.headers.Authorization='Bearer '+localStorage.getItem('token')
            let new_owner = JSON.parse(originalRequest.data)
            new_owner['owner']=localStorage.getItem('token')
            originalRequest.data=JSON.stringify(new_owner)

            return $authHost.request(originalRequest)
        } catch (e) {
            console.log(e)
            return e
        }

    }
    return config;
},async (error) => {
    console.log(error)
    // const originalRequest = error.config;
    // if (error.response.status == 401 && error.config && !error.config._isRetry) {
    //     originalRequest._isRetry = true;
    //     try {
    //         const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
    //         localStorage.setItem('token', response.data.accessToken);
    //         return $api.request(originalRequest);
    //     } catch (e) {
    //         console.log('НЕ АВТОРИЗОВАН')
    //     }
    // }
    // throw error;
})



$authHostWithoutBodyChange.interceptors.response.use(async (config) => {
    if(config.data?.message=='Unauthorized'){
        const originalRequest=config.config
        try {
            const response = await axios.get(`${API_URL}/user/refresh`, {withCredentials: true})
            if (response.data.message) {
                return 'invalid token'
            } else {
                localStorage.setItem('token', response.data.accessToken);
            }
            originalRequest.headers.Authorization='Bearer '+localStorage.getItem('token')
            // let new_owner = JSON.parse(originalRequest.data)
            // new_owner['owner']=localStorage.getItem('token')
            // originalRequest.data=JSON.stringify(new_owner)

            return $authHost.request(originalRequest)
        } catch (e) {
            console.log(e)
            return e
        }

    }
    return config;
},async (error) => {
    console.log(error)
    // const originalRequest = error.config;
    // if (error.response.status == 401 && error.config && !error.config._isRetry) {
    //     originalRequest._isRetry = true;
    //     try {
    //         const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
    //         localStorage.setItem('token', response.data.accessToken);
    //         return $api.request(originalRequest);
    //     } catch (e) {
    //         console.log('НЕ АВТОРИЗОВАН')
    //     }
    // }
    // throw error;
})


export{
    $host,
    $authHost,
    $refreshHost,
    $authHostWithoutBodyChange
}