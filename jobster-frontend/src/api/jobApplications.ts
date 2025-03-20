import { API_URL } from "./api.config";
import apiClient from "./axiosClient";

export const getUserJobApplications = async () => {
    try {
      const response = await apiClient.get(`${API_URL}/job-applications/`);
      return Array.isArray(response.data) ? response.data : []; // Gwarancja zwrócenia tablicy
    } catch (error) {
      console.error("Error fetching job applications:", error);
      return []; // Zwróć pustą tablicę w razie błędu
    }
  };
  
export const changeApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const response = await apiClient.put(`${API_URL}/job-applications/${applicationId}`, status);
      return response.data;
    } catch (error) {
      console.error("Error changing application status:", error);
      return null;
    }
  }