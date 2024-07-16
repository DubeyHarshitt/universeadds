import axios from 'axios'
import { useMutation, useQuery } from 'react-query'
import { IGroupCreateForm } from 'src/pages/Messaging/ContactsList/ContactTable/ContactTableStruct'
import { axiosInstance } from './axiosInstance';
import { IAddContactFormInput } from 'src/pages/Messaging/ContactsList/TableContent/AddContacts';
import clearToken from 'src/util/clearToken';


const addContactDetails = async (data: IAddContactFormInput) => {
    const response = await axiosInstance.post('/v1/bulkmessage/addContactDetails', data);
    return response.data;
}

const addContactDetailsE = async (data: IAddContactFormInput) => {
    const response = await axiosInstance.post('/v1/bulkmessage/addContactDetailsE', data);
    return response.data;
}

const fetchContactDetails = async () => {
    const response = await axiosInstance.get('/v1/bulkmessage/getContactDetails')
    return response.data;
}

const fetchContactDetailsE = async () => {
    const response = await axiosInstance.get('/v1/bulkmessage/getContactDetailsE')
    return response.data;
}

export const useAddContactDetails = (isEmployee: boolean) => {
    if (isEmployee) return useMutation(addContactDetailsE)
    return useMutation(addContactDetails);
};

export const useGetContactDetails = () => {
    return useQuery({
        queryKey: ["getContacts"],
        queryFn: () => fetchContactDetails(),
        staleTime: Infinity
    })
}


export const useGetContactDetailsE = () => {
    return useQuery({
        queryKey: ["getContactsE"],
        queryFn: () => fetchContactDetailsE(),
        staleTime: Infinity
    })
}
