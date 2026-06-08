import React from 'react';

const CategoryFilter = ({ locations, selectedLocation, onSelectLocation }) => {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
      <label style={{ fontWeight: 'bold' }}>Filtrer par Lieu :</label>
      <select 
        value={selectedLocation} 
        onChange={(e) => onSelectLocation(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="">Tous les lieux</option>
        {locations.map((loc, index) => (
          <option key={index} value={loc}>{loc}</option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;