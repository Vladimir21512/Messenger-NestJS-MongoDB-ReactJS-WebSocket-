import {$host, $authHost, $refreshHost, $authHostWithoutBodyChange} from "./index";
import axios from "axios";

export const registration = async(body)=>{
    const {data} = await $host.post('/user/create', body)
    return data
}

export const login = async(body)=>{
    const {data} = await $host.post('/user/login', body, {withCredentials:true})
    return data
}

export const GetChatList = async(userId)=>{
    const {data} = await $host.post('/chat/getAll', userId)
    return data
}

export const check = async(accessToken)=>{
    const data = await $refreshHost.post('/user/check', accessToken, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
    return data
}

export const addContact = async(body)=>{
    const {data} = await $authHost.post('/user/add', body, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
    return data
}

export const DeleteContact = async(body)=>{
    const {data} = await $authHostWithoutBodyChange.post('/user/deleteContact', body, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
    return data
}

export const GetContacts = async(id)=>{
    const {data} = await $host.get('/user/contacts/'+id, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
    return data
}

export const ChangePhoto = async(body)=>{
    const {data} = await $host.post('/user/changephoto',body, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
    return data
}

export const DeletePhoto= async(body)=>{
    const {data} = await $host.post('/user/deletephoto',body, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
    return data
}

export const findOne = async(body)=>{
    const {data} = await $authHostWithoutBodyChange.post('/user/findone',body, {headers:{Authorization:'Bearer '+localStorage.getItem('token')}})
    return data
}
//refresh :{refreshToken:localStorage.getItem('token')}
// export const Refresh = async(refresh)=>{
//     const {data} = await $host.post('/user/refresh', refresh)
//     return data
// }
