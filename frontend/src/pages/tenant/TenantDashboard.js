import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import { Home, DollarSign, Wrench, MessageSquare } from 'lucide-react';
import { rentalService, paymentService, maintenanceService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeRentals: 0,
    pendingPayments: 0,
    openMaintenance: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [rentalsRes, paymentsRes, maintenanceRes] = await Promise.all([
          rentalService.getTenantRentals(),
          paymentService.getTenantPayments(),
          maintenanceService.getTenantRequests(),
        ]);

        const rentals = rentalsRes.data || [];
        const payments = paymentsRes.data || [];
        const maintenance = maintenanceRes.data || [];

        setStats({
          activeRentals: rentals.filter(r => r.status === 'active').length,
          pendingPayments: payments.filter(p => p.status === 'pending').length,
          openMaintenance: maintenance.filter(m => m.status !== 'resolved').length,
        });

        setRecentPayments(payments.slice(0, 3));
        setRecentMaintenance(maintenance.slice(0, 3));
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'var(--danger)', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'Tenant'} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your rental activity.</p>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2.5rem' }}>
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon={<Home size={24} />}
          color="var(--primary)"
          delay={0}
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={<DollarSign size={24} />}
          color="var(--warning)"
          delay={0.1}
        />
        <StatCard
          title="Open Requests"
          value={stats.openMaintenance}
          icon={<Wrench size={24} />}
          color="var(--danger)"
          delay={0.2}
        />
        <StatCard
          title="Messages"
          value="Inbox"
          icon={<MessageSquare size={24} />}
          color="var(--accent)"
          delay={0.3}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Payments */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Payments</h3>
          {recentPayments.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No payments yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentPayments.map(p => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{p.property?.title || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '600' }}>${p.amount?.toLocaleString()}</span>
                    <span className={`badge ${p.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Maintenance */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Maintenance Requests</h3>
          {recentMaintenance.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No requests yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentMaintenance.map(m => (
                <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {m.property?.title || '—'}
                    </div>
                  </div>
                  <span className={`badge ${m.status === 'resolved' ? 'badge-success' : m.status === 'in-progress' ? 'badge-warning' : 'badge-danger'}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TenantDashboard;
