import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import { Building, Users, DollarSign, Wrench } from 'lucide-react';
import { propertyService, rentalService, paymentService, maintenanceService } from '../../services';

const LandlordDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeTenants: 0,
    monthlyRevenue: 0,
    pendingMaintenance: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [propertiesRes, rentalsRes, paymentsRes, maintenanceRes] = await Promise.all([
          propertyService.getMine(),
          rentalService.getLandlordRentals(),
          paymentService.getLandlordPayments(),
          maintenanceService.getLandlordRequests(),
        ]);

        const properties = propertiesRes.data || [];
        const rentals = rentalsRes.data || [];
        const payments = paymentsRes.data || [];
        const maintenance = maintenanceRes.data || [];

        const activeRentals = rentals.filter(r => r.status === 'active');
        const pendingMaintenance = maintenance.filter(m => m.status === 'pending' || m.status === 'in-progress');
        const currentMonth = new Date().getMonth();
        const monthlyRevenue = payments
          .filter(p => new Date(p.createdAt).getMonth() === currentMonth && p.status === 'paid')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats({
          totalProperties: properties.length,
          activeTenants: activeRentals.length,
          monthlyRevenue,
          pendingMaintenance: pendingMaintenance.length,
        });

        setRecentPayments(payments.slice(0, 4));
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
          width: '40px', height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'var(--danger)', textAlign: 'center' }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="grid-cards" style={{ marginBottom: '2.5rem' }}>
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={<Building size={24} />}
          color="var(--primary)"
          delay={0}
        />
        <StatCard
          title="Active Tenants"
          value={stats.activeTenants}
          icon={<Users size={24} />}
          color="var(--accent)"
          delay={0.1}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          color="var(--warning)"
          delay={0.2}
        />
        <StatCard
          title="Pending Maintenance"
          value={stats.pendingMaintenance}
          icon={<Wrench size={24} />}
          color="var(--danger)"
          delay={0.3}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}>
              <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem' }}>Add Property</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>List a new rental unit</div>
            </div>
            <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}>
              <div style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '0.25rem' }}>View Payments</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Check recent rent payments</div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Payments</h3>
          {recentPayments.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No payments yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recentPayments.map((p) => (
                <div key={p._id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.status === 'paid' ? 'var(--accent)' : 'var(--warning)', marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      ${p.amount?.toLocaleString()} — {p.tenant?.name || 'Tenant'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandlordDashboard;
