import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, Bed, Bath, Search } from 'lucide-react';
import { propertyService } from '../../services';

const BrowseProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    propertyService.getAll()
      .then(res => setProperties(res.data || []))
      .catch(() => setError('Failed to load properties.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.address?.city?.toLowerCase().includes(search.toLowerCase()) ||
    p.address?.state?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Browse Properties</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Find your perfect rental home.</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '480px' }}>
        <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem', background: 'rgba(0,0,0,0.2)', width: '100%' }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading properties...</div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          {search ? 'No properties match your search.' : 'No properties available right now.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(property => (
            <div key={property._id} className="glass-panel" style={{ overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; }}
            >
              {/* Property Image Placeholder */}
              <div style={{ height: '160px', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={48} color="var(--primary)" style={{ opacity: 0.5 }} />
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{property.title}</h3>
                  <span className={`badge ${property.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                    {property.status || 'available'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <MapPin size={14} />
                  {property.address?.street && `${property.address.street}, `}
                  {property.address?.city}, {property.address?.state}
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {property.bedrooms !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Bed size={14} /> {property.bedrooms} bed
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Bath size={14} /> {property.bathrooms} bath
                    </div>
                  )}
                  {property.type && (
                    <div style={{ textTransform: 'capitalize' }}>{property.type}</div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                      ${property.rent?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/mo</span>
                  </div>
                  <Link
                    to={`/tenant/properties/${property._id}`}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseProperties;
