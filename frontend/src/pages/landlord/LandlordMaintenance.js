import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { maintenanceService } from '../../services';

const LandlordMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    maintenanceService.getLandlordRequests()
      .then(res => setRequests(res.data || []))
      .catch(() => setError('Failed to load maintenance requests.'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (id, newStatus) => {
    setUpdating(id);
    try {
      await maintenanceService.update(id, { status: newStatus });
      setRequests(prev =>
        prev.map(r => r._id === id ? { ...r, status: newStatus } : r)
      );
    } catch {
      alert('Failed to update request.');
    } finally {
      setUpdating(null);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      default: return 'var(--primary)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertTriangle size={16} color="var(--danger)" />;
      case 'in-progress': return <Clock size={16} color="var(--warning)" />;
      case 'resolved': return <CheckCircle size={16} color="var(--accent)" />;
      default: return null;
    }
  };

  const nextStatus = (current) => {
    if (current === 'pending') return 'in-progress';
    if (current === 'in-progress') return 'resolved';
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Maintenance Requests</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and manage property maintenance tasks.</p>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading requests...</div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
      ) : requests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No maintenance requests found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map(req => (
            <div key={req._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '4px', height: '40px', backgroundColor: getPriorityColor(req.priority), borderRadius: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{req.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      #{req._id?.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {req.property?.title || '—'} • {req.tenant?.name || '—'} • {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                  {req.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                      {req.description}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Priority</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: getPriorityColor(req.priority), textTransform: 'capitalize' }}>
                    {req.priority || 'low'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize' }}>
                    {getStatusIcon(req.status)} {req.status}
                  </div>
                </div>
                {nextStatus(req.status) && (
                  <button
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1rem', opacity: updating === req._id ? 0.5 : 1 }}
                    onClick={() => handleUpdate(req._id, nextStatus(req.status))}
                    disabled={updating === req._id}
                  >
                    {updating === req._id ? 'Updating...' : `Mark ${nextStatus(req.status)}`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenance;
