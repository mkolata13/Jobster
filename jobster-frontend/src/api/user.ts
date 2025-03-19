import { API_URL } from "./api.config";
import apiClient from "./axiosClient";

export const getProfile = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/me`);
        console.log("Fetched profile:", response.data); // Log the response
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}
