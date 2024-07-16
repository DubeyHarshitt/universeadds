import axios from 'axios'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { IFormInput } from 'src/pages/Messaging/Whatsapp'
import { INewSenderInput } from 'src/pages/Messaging/Whatsapp/newSender'
import { axiosInstance } from './axiosInstance'
import loggedInUser from 'src/util/loggedInUser'

// const fetchMessages = () => {
//     return axios.get("http://localhost:8089/v1/bulkmessage/getAllMessages")
// }
const addNewSender = async (data: INewSenderInput) => {
    const response = await axiosInstance.post('/v1/bulkmessage/initialize-sender', data);
    return response.data;
}
const fetchSenders = async (owner: string) => {
    const response = await axiosInstance.get('/v1/bulkmessage/get-senders/' + owner)
    return response.data;
}
const verifySender = async (number: string) => {
    return axios.get(`http://localhost:8089/v1/bulkmessage/verify-sender?senderId=${number}`)
}
// export const useFetchMessages = () => {
//     return useQuery({
//         queryKey: ["messages"],
//         queryFn: () => fetchMessages(),
//         staleTime: Infinity
//     })
// }

export const useAddNewSender = () => {
    return useMutation(addNewSender)
}

export const useFetchSenders = () => {
    return useQuery({
        queryKey: ["senders"],
        queryFn: () => fetchSenders(loggedInUser()),
        staleTime: Infinity
    })
}
export const verifyNewSender = (number: string) => {
    return useQuery({
        queryFn: () => verifySender(number),
        enabled: false,
    })
}
