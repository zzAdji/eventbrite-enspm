import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventDetail from './pages/EventDetail';
import TicketSuccess from './pages/TicketSuccess';

// Petit composant temporaire pour le catalogue d'accueil (en attendant l'intégration finale)
const HomePlaceholder = () => (
  <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>EventBrite ENSPM</h1>
    <p style={{ color: '#3A3A3C', marginBottom: '24px' }}>Plateforme de réservation d'événements universitaires.</p>
    <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #D1D1D6', inlineSize: 'max-content', margin: '0 auto' }}>
      <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 12px 0' }}>Lien de test vers un événement :</p>
      <Link to="/events/1" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#5856D6', color: '#FFFFFF', textDecoration: 'none', borderRadius: '100px', fontWeight: '600' }}>
        Voir l'événement test (ID: 1)
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F8FA' }}>
        {/* Barre de navigation optionnelle commune */}
        <nav style={{ backgroundColor: '#FFFFFF', padding: '16px 40px', borderBottom: '1px solid #D1D1D6', fontFamily: 'Inter, sans-serif', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', textDecoration: 'none' }}>
            🎓 ENSPM Events
          </Link>
        </nav>

        {/* Définition des routes de navigation de l'application */}
        <Routes>
          {/* Route d'accueil */}
          <Route path="/" element={<HomePlaceholder />} />
          
          {/* Route vers la page détails codée au Jour 4 */}
          <Route path="/events/:id" element={<EventDetail />} />
          
          {/* Route vers ton Billet Numérique codé au Jour 5 */}
          <Route path="/ticket/:code" element={<TicketSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;