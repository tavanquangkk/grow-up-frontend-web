import axiosInstance from './axiosInstance';
import { API_CONFIG } from '../core/config/apiConfig';

export const getUpComingWorkshops = async () => {
  const response = await axiosInstance.get('/workshops');
  return response.data.data;
};

export const getMyWorkshops = async () => {
  const response = await axiosInstance.get('/workshops/me');
  return response.data.data;
};

export const createWorkshop = async (workshopData) => {
  const response = await axiosInstance.post('/workshops', workshopData);
  return response.data;
};

export const updateWorkshop = async (id, workshopData) => {
  const response = await axiosInstance.put(`/workshops/${id}`, workshopData);
  return response.data;
};

export const deleteWorkshop = async (id) => {
  const response = await axiosInstance.delete(`/workshops/${id}`);
  return response.data;
};

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get('/users/recommend');
  return response.data.data;
};

export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await axiosInstance.put('/users/me', profileData);
  return response.data;
};

export const getSkillsList = async () => {
  const response = await axiosInstance.get('/skills');
  return response.data.data;
};

export const followUser = async (userId) => {
  const response = await axiosInstance.post(`/users/me/follow/${userId}`);
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await axiosInstance.delete(`/users/me/follow/${userId}`);
  return response.data;
};
