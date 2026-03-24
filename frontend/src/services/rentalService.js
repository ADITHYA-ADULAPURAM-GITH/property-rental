import axios from 'axios';

const API = 'http://localhost:5000/api/rentals';

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
  },
});

const createRental = (data) => axios.post(API, data, getConfig());
const getLandlordRentals = () => axios.get(`${API}/landlord`, getConfig());
const getTenantRentals = () => axios.get(`${API}/tenant`, getConfig());
const getRental = (id) => axios.get(`${API}/${id}`, getConfig());
const updateRentalStatus = (id, data) => axios.put(`${API}/${id}/status`, data, getConfig());

export default {
  createRental,
  getLandlordRentals,
  getTenantRentals,
  getRental,
  updateRentalStatus,
};