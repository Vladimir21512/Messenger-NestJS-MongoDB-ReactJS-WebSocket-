import {$host, $authHost, $refreshHost} from "./index";
import axios from "axios";

export const create_chat = async(body)=>{
    const {data} = await $host.post('/chat', body)
    return data
}
export const delete_chat = async(body)=>{
    const {data} = await $host.post('/chat/add_delete_info', body)
    return data
}