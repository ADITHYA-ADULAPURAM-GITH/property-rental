import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { rentalService } from '../../services';

const LandlordRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    rentalService.getLandlordRentals()
      .then(res => setRentals(res.data || []))
      .catch(() => setError('Failed to load rentals.'))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id + '-approve');
    try {
      await rentalService.approve(id);
      setRentals(prev =>
        prev.map(r => r._id === id ? { ...r, status: 'active' } : r)
      );
    } catch {
      alert('Failed to approve rental.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '-reject');
    try {
      await rentalService.reject(id);
      setRentals(prev =>
        prev.map(r => r._id === id ? { ...r, status: 'rejected' } : r)
      );
    } catch {
      alert('Failed to reject rental.');
    } finally {
      setActionLoading(null);
    }
  };

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
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Rentals & Applications</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your rental agreements and tenant applications.</p>
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
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Lease Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentals.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No rentals found.
                    </td>
                  </tr>
                ) : (
                  rentals.map(rental => (
                    <tr key={rental._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {rental.tenant?.name?.charAt(0) || '?'}
                          </div>
                          <div style={{ fontWeight: '500' }}>{rental.tenant?.name || '—'}</div>
                        </div>
                      </td>
                      <td>{rental.property?.title || '—'}</td>
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
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                            <FileText size={14} style={{ marginRight: '0.25rem' }} /> View
                          </button>
                          {rental.status === 'pending' && (
                            <>
                              <button
                                style={{ color: 'var(--accent)', background: 'transparent', opacity: actionLoading ? 0.5 : 1 }}
                                title="Approve"
                                onClick={() => handleApprove(rental._id)}
                                disabled={!!actionLoading}
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                style={{ color: 'var(--danger)', background: 'transparent', opacity: actionLoading ? 0.5 : 1 }}
                                title="Reject"
                                onClick={() => handleReject(rental._id)}
                                disabled={!!actionLoading}
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
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

export default LandlordRentals;
