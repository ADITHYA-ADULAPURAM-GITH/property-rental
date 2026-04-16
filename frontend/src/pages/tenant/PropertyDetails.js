import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Home, ArrowLeft, CheckCircle } from 'lucide-react';
import { propertyService, rentalService } from '../../services';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    propertyService.getById(id)
      .then(res => setProperty(res.data))
      .catch(() => setError('Failed to load property details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!window.confirm(`Apply to rent "${property.title}"?`)) return;
    setApplying(true);
    try {
      await rentalService.apply(id);
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="animate-fade-in">
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error || 'Property not found.'}</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Properties
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Info */}
        <div>
          {/* Image */}
          <div className="glass-panel" style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))' }}>
            <Home size={80} color="var(--primary)" style={{ opacity: 0.4 }} />
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0 }}>{property.title}</h1>
              <span className={`badge ${property.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                {property.status || 'available'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              <MapPin size={16} />
              {[property.address?.street, property.address?.city, property.address?.state, property.address?.zipCode]
                .filter(Boolean).join(', ')}
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              {property.bedrooms !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bed size={18} color="var(--primary)" />
                  <span><strong>{property.bedrooms}</strong> <span style={{ color: 'var(--text-secondary)' }}>Bedrooms</span></span>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bath size={18} color="var(--primary)" />
                  <span><strong>{property.bathrooms}</strong> <span style={{ color: 'var(--text-secondary)' }}>Bathrooms</span></span>
                </div>
              )}
              {property.type && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Home size={18} color="var(--primary)" />
                  <span style={{ textTransform: 'capitalize' }}>{property.type}</span>
                </div>
              )}
            </div>

            {property.description && (
              <>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Description</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 0 }}>{property.description}</p>
              </>
            )}
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Amenities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {property.amenities.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: 'rgba(59,130,246,0.1)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                    <CheckCircle size={14} color="var(--primary)" /> {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Price & Apply */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
                ${property.rent?.toLocaleString()}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>/month</span>
            </div>

            {applied ? (
              <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent)' }}>
                <CheckCircle size={20} />
                Application submitted! Awaiting landlord approval.
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.875rem' }}
                onClick={handleApply}
                disabled={applying || property.status !== 'available'}
              >
                {applying ? 'Submitting...' : property.status !== 'available' ? 'Not Available' : 'Apply Now'}
              </button>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {property.landlord && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Landlord</span>
                  <span style={{ fontWeight: '500' }}>{property.landlord.name || '—'}</span>
                </div>
              )}
              {property.type && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Type</span>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{property.type}</span>
                </div>
              )}
              {property.size && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Size</span>
                  <span style={{ fontWeight: '500' }}>{property.size} sq ft</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
