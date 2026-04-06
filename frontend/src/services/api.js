import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const getUserById = (id) => API.get(`/users/${id}`);
export const createProject = (data) => API.post('/projects/create', data);
export const getProjects = () => API.get('/projects');
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const sendRequest = (data) => API.post('/requests/send', data);
export const getProjectRequests = (projectId) => API.get(`/requests/project/${projectId}`);
export const getMyRequests = () => API.get('/requests/my');
export const acceptRequest = (requestId) => API.put(`/requests/accept/${requestId}`);
export const rejectRequest = (requestId) => API.put(`/requests/reject/${requestId}`);
export const getGitHubRepos = (username) =>
  axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

export default API;
