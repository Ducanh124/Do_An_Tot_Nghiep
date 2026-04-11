import {api} from "../libs/axios.js"

export const login = async (data)=>{
    const res = await api.post('/auth/sign-in', data);
    return res.data
}

export const regis = async (data)=>{
    const res = await api.post('/auth/sign-up', data);
    return res.data
}