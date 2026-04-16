import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/common/Layout';

import LandlordDashboard from './pages/landlord/LandlordDashboard';
import ManageProperties from './pages/landlord/ManageProperties';
import LandlordRentals from './pages/landlord/LandlordRentals';
import LandlordPayments from './pages/landlord/LandlordPayments';
import LandlordMaintenance from './pages/landlord/LandlordMaintenance';
import LandlordMessages from './pages/landlord/LandlordMessages';

import TenantDashboard from './pages/tenant/TenantDashboard';
import BrowserProperties from './pages/tenant/BrowserProperties';
import PropertyDetails from './pages/tenant/PropertyDetails';
import TenantRentals from './pages/tenant/TenantRentals';
import TenantPayments from './pages/tenant/TenantPayments';
import TenantMaintenance from './pages/tenant/TenantMaintenance';
import TenantMessages from './pages/tenant/TenantMessages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/landlord" element={<Layout />}>
            <Route path="dashboard" element={<LandlordDashboard />} />
            <Route path="properties" element={<ManageProperties />} />
            <Route path="rentals" element={<LandlordRentals />} />
            <Route path="payments" element={<LandlordPayments />} />
            <Route path="maintenance" element={<LandlordMaintenance />} />
            <Route path="messages" element={<LandlordMessages />} />
          </Route>

          <Route path="/tenant" element={<Layout />}>
            <Route path="dashboard" element={<TenantDashboard />} />
            <Route path="browse" element={<BrowserProperties />} />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="rentals" element={<TenantRentals />} />
            <Route path="payments" element={<TenantPayments />} />
            <Route path="maintenance" element={<TenantMaintenance />} />
            <Route path="messages" element={<TenantMessages />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;