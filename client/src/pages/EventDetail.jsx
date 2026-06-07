import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../api/events';
import { bookTicket } from '../api/tickets';
import BookingModal from '../components/booking/BookingModal';

const EventDetail = () => {
  const { id } = useParams(); // Récupère l'identifiant de l'événement dans l'URL
  const navigate = useNavigate();

  // États pour la gestion des données de l'événement
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le comportement de la Modal et de la soumission
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Charger les détails de l'événement depuis le Back-end
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await getEventById(id);
        // Si la réponse respecte le format standardisé { success: true, data: ... }
        setEvent(response.data || response);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les détails de cet événement. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEventData();
  }, [id]);

  // Gérer la soumission du formulaire de réservation (Nom + Matricule)
  const handleBookingSubmit = async (formData) => {
    try {
      setBookingLoading(true);
      // Appel de la route POST /api/events/:id/tickets d'Alim
      const response = await bookTicket(id, formData);
      
      setIsModalOpen(false); // Ferme la pop-up

      // Récupère le code généré par le serveur (ex: EVT-8A4F2Z)
      const ticketCode = response.data?.reservationCode || response.reservationCode;

      // Redirige instantanément vers la page de succès du billet (Jour 5)
      navigate(`/ticket/${ticketCode}`);
    } catch (err) {
      // Gestion des erreurs serveurs (ex: Événement complet 400)
      const serverMessage = err.response?.data?.error?.message || "Une erreur est survenue lors de la réservation.";
      alert(serverMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  // 1. État de chargement (UX robuste)
  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement des détails de l'événement...</p>
      </div>
    );
  }

  // 2. Gestion des erreurs d'affichage
  if (error || !event) {
    return (
      <div style={styles.centerContainer}>
        <p style={styles.errorText}>{error || "Événement introuvable."}</p>
        <button onClick={() => navigate('/')} style={styles.backBtn}>Retour à l'accueil</button>
      </div>
    );
  }

  // Calcul du taux de remplissage et validation de capacité
  const isFull = event.bookedCount >= event.capacity;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backLink}>
        &larr; Retour aux événements
      </button>

      <div style={styles.mainLayout}>
        {/* Colonne de Gauche : Informations textuelles */}
        <div style={styles.infoColumn}>
          <span style={styles.categoryBadge}>{event.category || "Événement"}</span>
          <h1 style={styles.title}>{event.title}</h1>
          
          <div style={styles.metaGrid}>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Date et heure</span>
              <span style={styles.metaValue}>
                {new Date(event.eventDate).toLocaleDateString('fr-FR', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Lieu d'accueil</span>
              <span style={styles.metaValue}>{event.location}</span>
            </div>
          </div>

          <div style={styles.descriptionSection}>
            <h3 style={styles.sectionTitle}>Description de l'événement</h3>
            <p style={styles.descriptionText}>{event.description}</p>
          </div>
        </div>

        {/* Colonne de Droite : Boîte de réservation (Sticky UI) */}
        <div style={styles.ticketCard}>
          <h3 style={styles.cardHeaderTitle}>Disponibilité</h3>
          
          <div style={styles.gaugeContainer}>
            <div style={styles.gaugeLabels}>
              <span>Places réservées</span>
              <strong>{event.bookedCount} / {event.capacity}</strong>
            </div>
            {/* Barre de progression dynamique */}
            <div style={styles.progressBarBg}>
              <div style={{
                ...styles.progressBarFill,
                width: `${Math.min((event.bookedCount / event.capacity) * 100, 100)}%`,
                backgroundColor: isFull ? '#FF3B30' : (event.bookedCount / event.capacity > 0.7 ? '#FF9500' : '#34C759')
              }}></div>
            </div>
          </div>

          {/* Bouton de réservation interactif - Désactivé si complet conformément au cahier des charges */}
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isFull}
            style={{
              ...styles.bookingBtn,
              backgroundColor: isFull ? '#F2F2F7' : '#0A0A0A',
              color: isFull ? '#8E8E93' : '#FFFFFF',
              cursor: isFull ? 'not-allowed' : 'pointer'
            }}
          >
            {isFull ? 'Complet' : 'Réserver ma place'}
          </button>
        </div>
      </div>

      {/* Intégration de la pop-up BookingModal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBookingSubmit}
        eventTitle={event.title}
        isLoading={bookingLoading}
      />
    </div>
  );
};

// Styles CSS-in-JS conformes à l'Architecture et aux tokens graphiques (Neutral Premium)
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif",
  },
  backLink: {
    background: 'none',
    border: 'none',
    color: '#5856D6',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '24px',
    padding: 0,
  },
  mainLayout: {
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  infoColumn: {
    flex: '2',
    minWidth: '320px',
  },
  categoryBadge: {
    backgroundColor: '#5856D6',
    color: '#FFFFFF',
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#0A0A0A',
    margin: '16px 0 24px 0',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px 0',
    borderTop: '1px solid #D1D1D6',
    borderBottom: '1px solid #D1D1D6',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metaLabel: {
    fontSize: '12px',
    color: '#3A3A3C',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0A0A0A',
  },
  descriptionSection: {
    marginTop: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  descriptionText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#3A3A3C',
  },
  ticketCard: {
    flex: '1',
    minWidth: '300px',
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #D1D1D6',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  cardHeaderTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '700',
  },
  gaugeContainer: {
    marginBottom: '24px',
  },
  gaugeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '8px',
  },
  progressBarBg: {
    backgroundColor: '#E5E5EA',
    height: '8px',
    borderRadius: '100px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '100px',
    transition: 'width 0.4s ease',
  },
  bookingBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '100px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E5E5EA',
    borderTop: '4px solid #5856D6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: '#0A0A0A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '100px',
    cursor: 'pointer',
  },
};

export default EventDetail;