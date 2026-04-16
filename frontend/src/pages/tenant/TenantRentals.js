import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { rentalService } from '../../services';

const TenantRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    rentalService.getTenantRentals()
      .then(res => setRentals(res.data || []))
      .catch(() => setError('Failed to load your rentals.'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'completed': return 'badge-primary';
      case 'rejected': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '—';

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>My Rentals</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View your current and past rental agreements.</p>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading rentals...</div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Landlord</th>
                  <th>Monthly Rent</th>
                  <th>Lease Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      You have no rentals yet. Browse properties to apply!
                    </td>
                  </tr>
                ) : (
                  rentals.map(rental => (
                    <tr key={rental._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{rental.property?.title || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {rental.property?.address?.city}, {rental.property?.address?.state}
                        </div>
                      </td>
                      <td>{rental.landlord?.name || '—'}</td>
                      <td style={{ fontWeight: '600' }}>${rental.property?.rent?.toLocaleString() || '—'}</td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>
                          {formatDate(rental.startDate)}
                          <span style={{ color: 'var(--text-secondary)', margin: '0 0.25rem' }}>to</span>
                          {formatDate(rental.endDate)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(rental.status)}`}>
                          {rental.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FileText size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantRentals;
