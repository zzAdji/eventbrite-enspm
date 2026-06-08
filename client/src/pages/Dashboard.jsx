import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement du tableau de bord...</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>📊 Tableau de Bord Organisateur</h2>
      <p style={{ color: '#666' }}>Suivi en temps réel de la capacité des salles et des inscriptions.</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Événement</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Lieu</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>État du Remplissage</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{event.title}</td>
              <td style={{ padding: '12px' }}>{event.location}</td>
              <td style={{ padding: '12px', width: '40%' }}>
                {/* Réutilisation de la ProgressBar pour le suivi */}
                <ProgressBar booked={event.bookedCount} capacity={event.capacity} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;