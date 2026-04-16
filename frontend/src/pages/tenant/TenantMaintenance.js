import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Plus, X } from 'lucide-react';
import { maintenanceService, rentalService } from '../../services';

const TenantMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'low', propertyId: '' });

  useEffect(() => {
    Promise.all([
      maintenanceService.getTenantRequests(),
      rentalService.getTenantRentals(),
    ])
      .then(([mainRes, rentRes]) => {
        setRequests(mainRes.data || []);
        const active = (rentRes.data || []).filter(r => r.status === 'active');
        setRentals(active);
        if (active.length > 0) {
          setForm(f => ({ ...f, propertyId: active[0].property?._id || '' }));
        }
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.propertyId) return;
    setSubmitting(true);
    try {
      const res = await maintenanceService.create(form);
      setRequests(prev => [res.data, ...prev]);
      setShowForm(false);
      setForm(f => ({ ...f, title: '', description: '' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Maintenance Requests</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Submit and track maintenance issues for your rental.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowForm(true)}>
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* New Request Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '500px', maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>New Maintenance Request</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Property</label>
                <select
                  value={form.propertyId}
                  onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))}
                  required
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-primary)' }}
                >
                  {rentals.map(r => (
                    <option key={r._id} value={r.property?._id}>{r.property?.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Leaking faucet in kitchen"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', resize: 'vertical', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Priority</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['low', 'medium', 'high'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, priority: p }))}
                      style={{
                        flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid',
                        borderColor: form.priority === p ? getPriorityColor(p) : 'var(--border-color)',
                        background: form.priority === p ? `${getPriorityColor(p)}20` : 'transparent',
                        color: form.priority === p ? getPriorityColor(p) : 'var(--text-secondary)',
                        textTransform: 'capitalize', cursor: 'pointer', fontWeight: '500'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading requests...</div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
      ) : requests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No maintenance requests. Click "New Request" if you have an issue.
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
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {req.property?.title || '—'} • {new Date(req.createdAt).toLocaleDateString()}
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
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: getPriorityColor(req.priority), textTransform: 'capitalize' }}>{req.priority}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize' }}>
                    {getStatusIcon(req.status)} {req.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantMaintenance;
