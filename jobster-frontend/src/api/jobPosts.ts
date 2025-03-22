import { API_URL } from "./api.config";
import apiClient from "./axiosClient";

export const getJobPosts = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/job-posts/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job posts:", error);
        throw error;
    }
}

export const getMyJobPosts = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/job-posts/my`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job posts:", error);
        throw error;
    }
}

export const getJobPost = async (id: number) => {
    const response = await apiClient.get(`${API_URL}/job-posts/${id}`);
    return response.data;
}

export const createJobPost = async (jobPost: any) => {
    const response = await apiClient.post(`${API_URL}/job-posts/`, jobPost);
    return response.data;
}

export const getJobPostApplications = async (id: number) => {
    const response = await apiClient.get(`${API_URL}/job-posts/${id}/applications`);
    return response.data;
}

export const applyToJobPost = async (jobPostId: number) => {
    const response = await apiClient.post(`${API_URL}/job-posts/${jobPostId}`);
    return response.data;
}