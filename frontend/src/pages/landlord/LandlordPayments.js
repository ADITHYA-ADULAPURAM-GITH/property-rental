import React, { useState, useEffect } from 'react';
import { Download, CreditCard } from 'lucide-react';
import { paymentService } from '../../services';

const LandlordPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    paymentService.getLandlordPayments()
      .then(res => setPayments(res.data || []))
      .catch(() => setError('Failed to load payments.'))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    const header = 'Transaction ID,Tenant,Property,Date,Amount,Method,Status\n';
    const rows = payments.map(p =>
      `${p._id},${p.tenant?.name || ''},${p.property?.title || ''},${new Date(p.createdAt).toLocaleDateString()},${p.amount},${p.method || ''},${p.status}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Payments & Invoices</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track rent payments and generate invoices.</p>
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleExport}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading payments...</div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Tenant & Property</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map(payment => (
                    <tr key={payment._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {payment._id?.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: '500' }}>{payment.tenant?.name || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{payment.property?.title || '—'}</div>
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '600' }}>${payment.amount?.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                          <CreditCard size={14} color="var(--text-secondary)" />
                          {payment.method || 'Online'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${payment.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {payment.status}
                        </span>
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

export default LandlordPayments;
