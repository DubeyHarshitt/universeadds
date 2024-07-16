import axios from 'axios'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { IFormInput } from 'src/pages/Messaging/Whatsapp'

const fetchMessages = () => {
    return axios.get("http://localhost:8089/v1/bulkmessage/getAllMessages")
}
const addMessages = (data: IFormInput) => {
    console.log(data)
    return axios.post("http://localhost:8089/v1/bulkmessage/sendTextMessage", data)
}

export const useFetchMessages = () => {
    return useQuery({
        queryKey: ["messages"],
        queryFn: () => fetchMessages(),
        staleTime: Infinity
    })
}

export const useAddMessages = () => {
    return useMutation(addMessages)
}
