import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const fetchMaterials = (search = '') => API.get(`/materials?search=${search}`);
export const uploadMaterial = (formData) => API.post('/materials', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteMaterial = (id) => API.delete(`/materials/${id}`);

export const fetchQuestions = () => API.get('/qa');
export const askQuestion = (data) => API.post('/qa', data);
export const answerQuestion = (id, data) => API.post(`/qa/${id}/answers`, data);

export default API;
