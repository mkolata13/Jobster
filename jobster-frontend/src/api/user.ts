import { API_URL } from "./api.config";
import apiClient from "./axiosClient";

export const getProfile = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/users/me`);
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}

export const updateEmployerInfo = async (companyName: String, companyWebsite: String) => {
    const response = await apiClient.patch(`${API_URL}/users/update-employer`, {companyName, companyWebsite});
    return response.data;
}

export const updateJobSeekerInfo = async (firstName: String, lastName: String) => {
    const response = await apiClient.patch(`${API_URL}/users/update-job-seeker`, {firstName, lastName});
    return response.data;
}