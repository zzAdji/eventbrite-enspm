import React from 'react';

const ProgressBar = ({ booked, capacity }) => {
  // Calcul du pourcentage (sans dépasser 100%)
  const percentage = Math.min((booked / capacity) * 100, 100);
  const isFull = booked >= capacity;

  return (
    <div style={{ width: '100%', margin: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
        <span>{booked} / {capacity} places réservées</span>
        {isFull && <span style={{ color: 'red', fontWeight: 'bold' }}>COMPLET</span>}
      </div>
      <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
        <div style={{ 
          width: `${percentage}%`, 
          backgroundColor: isFull ? '#f44336' : '#4CAF50', 
          height: '100%', 
          transition: 'width 0.3s ease' 
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;