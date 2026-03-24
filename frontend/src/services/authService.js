import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
  },
});

const getMe = () => axios.get(`${API}/me`, getConfig());
const updateProfile = (data) => axios.put(`${API}/profile`, data, getConfig());

export default { getMe, updateProfile };