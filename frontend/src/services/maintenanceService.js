import axios from 'axios';

const API = 'http://localhost:5000/api/maintenance';

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
  },
});

const createMaintenance = (data) => axios.post(API, data, getConfig());
const getLandlordMaintenance = () => axios.get(`${API}/landlord`, getConfig());
const getTenantMaintenance = () => axios.get(`${API}/tenant`, getConfig());
const getMaintenance = (id) => axios.get(`${API}/${id}`, getConfig());
const updateMaintenance = (id, data) => axios.put(`${API}/${id}`, data, getConfig());

export default {
  createMaintenance,
  getLandlordMaintenance,
  getTenantMaintenance,
  getMaintenance,
  updateMaintenance,
};