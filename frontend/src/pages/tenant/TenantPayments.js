import React, { useEffect, useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { paymentService, rentalService } from '../../services';

const TenantPayments = () => {
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    Promise.all([
      paymentService.getTenantPayments(),
      rentalService.getTenantRentals(),
    ])
      .then(([paymentsRes, rentalsRes]) => {
        setPayments(paymentsRes.data || []);
        setRentals((rentalsRes.data || []).filter(r => r.status === 'active'));
      })
      .catch(() => setError('Failed to load payment data.'))
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (rental) => {
    if (!window.confirm(`Pay $${rental.property?.rent?.toLocaleString()} for ${rental.property?.title}?`)) return;
    setPaying(rental._id);
    try {
      const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const res = await paymentService.pay(rental._id, rental.property?.rent, month);
      setPayments(prev => [res.data, ...prev]);
      alert('Payment successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed.');
    } finally {
      setPaying(null);
    }
  };

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>My Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View your payment history and make rent payments.</p>
      </div>

      {/* Summary Card */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Paid</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>${totalPaid.toLocaleString()}</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Transactions</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{payments.length}</div>
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} color="var(--warning)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{payments.filter(p => p.status === 'pending').length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Rent Buttons for active rentals */}
      {!loading && rentals.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Pay Rent</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {rentals.map(rental => (
              <button
                key={rental._id}
                className="btn btn-primary"
                onClick={() => handlePay(rental)}
                disabled={paying === rental._id}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <DollarSign size={16} />
                {paying === rental._id ? 'Processing...' : `Pay $${rental.property?.rent?.toLocaleString()} — ${rental.property?.title}`}
              </button>
            ))}
          </div>
        </div>
      )}

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
                  <th>Property</th>
                  <th>Month</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No payment history yet.
                    </td>
                  </tr>
                ) : (
                  payments.map(payment => (
                    <tr key={payment._id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        #{payment._id?.slice(-8).toUpperCase()}
                      </td>
                      <td>{payment.property?.title || '—'}</td>
                      <td>{payment.month || '—'}</td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '600' }}>${payment.amount?.toLocaleString()}</td>
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

export default TenantPayments;
