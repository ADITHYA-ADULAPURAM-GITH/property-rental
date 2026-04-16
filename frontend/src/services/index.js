import api from './api';

// --- Auth ---
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, phone, role) =>
    api.post('/auth/register', { name, email, password, phone, role }),
  getMe: () => api.get('/auth/me'),
  switchRole: (role) => api.put('/auth/switch-role', { role }),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// --- Properties ---
export const propertyService = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  getMine: () => api.get('/properties/landlord/mine'),
};

// --- Rentals ---
export const rentalService = {
  getTenantRentals: () => api.get('/rentals/tenant'),
  getLandlordRentals: () => api.get('/rentals/landlord'),
  apply: (propertyId) => api.post('/rentals', { propertyId }),
  approve: (id) => api.put(`/rentals/${id}/approve`),
  reject: (id) => api.put(`/rentals/${id}/reject`),
};

// --- Payments ---
export const paymentService = {
  getTenantPayments: () => api.get('/payments/tenant'),
  getLandlordPayments: () => api.get('/payments/landlord'),
  pay: (rentalId, amount, month) =>
    api.post('/payments', { rentalId, amount, month }),
};

// --- Maintenance ---
export const maintenanceService = {
  getTenantRequests: () => api.get('/maintenance/tenant'),
  getLandlordRequests: () => api.get('/maintenance/landlord'),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
};

// --- Messages ---
export const messageService = {
  getConversations: () => api.get('/messages'),
  getThread: (userId) => api.get(`/messages/${userId}`),
  send: (receiverId, content) =>
    api.post('/messages', { receiverId, content }),
};
