import axios from 'axios';
import { useMutation } from 'react-query';

const ROOT_URL = process.env.REACT_APP_ROOT_URL;

const getToken = async ({ userName, password }) => {
    const response = await axios.post(`${ROOT_URL}/auth/token`, {
        userName,
        password
    });
    return response.data;
};

const validateToken = async (token: string) => {
    const response = await axios.get(`${ROOT_URL}/auth/validate?token=${token}`).then((res) => res.data).catch((err) => err.data)
    return response;
}
export const useGetToken = () => {
    return useMutation(getToken);
};

export const useValidateToken = () => {
    return useMutation(validateToken);
}