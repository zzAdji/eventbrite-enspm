import React from 'react';
import EventCatalog from './EventCatalog';

const HomePage = ({ onSelectEvent }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '4px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ color: '#007BFF' }}>Campus Events 🎟️</h1>
        <p style={{ color: '#555' }}>La plateforme de billetterie locale pour les clubs étudiants de l'ENSPM.</p>
      </header>
      
      <main>
        {/* Le catalogue est directement intégré ici */}
        <EventCatalog onSelectEvent={onSelectEvent} />
      </main>
    </div>
  );
};

export default HomePage;