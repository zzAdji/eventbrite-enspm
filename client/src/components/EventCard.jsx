import React from 'react';
import ProgressBar from './ProgressBar';

const EventCard = ({ event, onSelect }) => {
  const isFull = event.bookedCount >= event.capacity; // Validation de la jauge [cite: 73]

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{event.title}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>{event.description}</p>
        <p style={{ fontSize: '0.85rem' }}>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
        <p style={{ fontSize: '0.85rem' }}>📍 <strong>{event.location}</strong></p>
      </div>
      
      <div>
        {/* Intégration de la ProgressBar */}
        <ProgressBar booked={event.bookedCount} capacity={event.capacity} />
        
        <button 
          onClick={() => onSelect(event._id)}
          disabled={isFull} // Empêche visuellement la réservation si plein [cite: 73]
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isFull ? '#ccc' : '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isFull ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          {isFull ? 'Complet' : 'Réserver ma place'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;