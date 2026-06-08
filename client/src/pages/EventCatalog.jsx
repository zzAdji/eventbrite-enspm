import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import { apiService } from '../services/api';

const EventCatalog = ({ onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Connexion à l'API au chargement du composant [cite: 44, 45]
  useEffect(() => {
    apiService.getEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Chargement des événements à venir...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Erreur : {error}</p>;

  // Extraire la liste unique des lieux pour le filtre
  const locations = [...new Set(events.map(event => event.location))];

  // Filtrer les événements selon le choix de l'étudiant
  const filteredEvents = selectedLocation
    ? events.filter(event => event.location === selectedLocation)
    : events;

  return (
    <div>
      <h2 style={{ marginBottom: '15px' }}>Événements à venir</h2>
      
      {/* Composant de filtrage */}
      <CategoryFilter 
        locations={locations} 
        selectedLocation={selectedLocation} 
        onSelectLocation={setSelectedLocation} 
      />

      {filteredEvents.length === 0 ? (
        <p>Aucun événement disponible pour le moment.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {filteredEvents.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              onSelect={onSelectEvent} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCatalog;