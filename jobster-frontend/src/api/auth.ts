import { User } from "../types/User";
import { API_URL } from "./api.config";
import apiClient from "./axiosClient";

export const registerUser = async (user: User) => {
    const response = await apiClient.post(`${API_URL}/auth/signup`, user);
    return response.data;
}

export const login = async (email: string, password: string) => {
    const response = await apiClient.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
}

export const resendVerificationCode = async (email: string) => {
    const response = await apiClient.post(`${API_URL}/auth/resend?email=${email}`);
    return response.data;
}

export const verifyUser = async (email: string, code: string) => {
    const response = await apiClient.post(`${API_URL}/auth/verify`, { email, code });
    return response.data;
}
