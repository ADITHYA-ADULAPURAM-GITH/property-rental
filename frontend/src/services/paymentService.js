import axios from 'axios';

const API = 'http://localhost:5000/api/payments';

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
  },
});

const createPayment = (data) => axios.post(API, data, getConfig());
const getTenantPayments = () => axios.get(`${API}/tenant`, getConfig());
const getLandlordPayments = () => axios.get(`${API}/landlord`, getConfig());
const getRentDue = (month) => axios.get(`${API}/due/${month}`, getConfig());

export default {
  createPayment,
  getTenantPayments,
  getLandlordPayments,
  getRentDue,
};