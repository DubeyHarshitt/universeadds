import { useMutation, useQuery } from 'react-query'
import { IFormInputInsta } from 'src/pages/Messaging/Instagram/Insta'
import { axiosInstance } from './axiosInstance';

axiosInstance.defaults.headers.common['Content-Type'] = undefined;
const scheduleInstagram = async (formData: FormData) => {
    console.log(localStorage.getItem('token'), 'token from ls');

    const response = await axiosInstance.post('/v1/bulkmessage/upload-instagram', formData, {
        headers: {
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
        }
    });
    console.log(response.request, 'req')
    return response.data;
}

export const useScheduleInstagram = () => {
    return useMutation(scheduleInstagram);
};