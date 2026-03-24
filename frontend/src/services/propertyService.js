import axios from 'axios';

const API = 'http://localhost:5000/api/properties';

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
  },
});

const getProperties = (filters = {}) => axios.get(API, { params: filters });
const getProperty = (id) => axios.get(`${API}/${id}`);
const getMyProperties = () => axios.get(`${API}/my-properties`, getConfig());
const createProperty = (data) => axios.post(API, data, getConfig());
const updateProperty = (id, data) => axios.put(`${API}/${id}`, data, getConfig());
const deleteProperty = (id) => axios.delete(`${API}/${id}`, getConfig());

export default {
  getProperties,
  getProperty,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};