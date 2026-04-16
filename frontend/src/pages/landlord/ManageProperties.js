import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Home } from 'lucide-react';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProperties([
        { id: '1', title: 'Sunset Apartments', type: 'Apartment', location: '124 Main St, NY', rent: 1200, status: 'Occupied' },
        { id: '2', title: 'Downtown Studio', type: 'Studio', location: '89 Broad St, NY', rent: 900, status: 'Vacant' },
        { id: '3', title: 'Suburban Family Home', type: 'House', location: '42 Oak Lane, NJ', rent: 2200, status: 'Occupied' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Manage Properties</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your property listings, updates, and statuses.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Property
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading properties...</div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property Details</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Monthly Rent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Home size={20} color="var(--primary)" />
                        </div>
                        <div style={{ fontWeight: '600' }}>{property.title}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={16} />
                        {property.location}
                      </div>
                    </td>
                    <td>{property.type}</td>
                    <td style={{ fontWeight: '600' }}>${property.rent}</td>
                    <td>
                      <span className={`badge ${property.status === 'Occupied' ? 'badge-primary' : 'badge-warning'}`}>
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button style={{ color: 'var(--text-secondary)', padding: '0.25rem', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                          <Edit2 size={18} />
                        </button>
                        <button style={{ color: 'var(--text-secondary)', padding: '0.25rem', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No properties found. Click "Add Property" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;