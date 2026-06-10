import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEventById } from '../api/events';
import { formatEventDate } from '../utils/dates';
import { getRemainingSeats, getCapacityStatus } from '../utils/capacity';
import CategoryIllustration from '../components/events/CategoryIllustration';
import ProgressBar from '../components/events/ProgressBar';
import BookingModal from '../components/booking/BookingModal';
import Button from '../components/ui/button';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      if (err.status === 404 || err.code === 'EVENT_NOT_FOUND') {
        setError('not_found');
      } else {
        setError(err.message || 'Impossible de charger cet événement.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBookingSuccess = () => {
    fetchEvent();
  };

  if (loading) {
    return (
      <div className="event-detail event-detail--loading" aria-busy="true">
        <div className="event-detail__skeleton" />
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <div className="event-detail event-detail--error">
        <h1>Événement introuvable</h1>
        <p>Cet événement n'existe pas ou a été supprimé.</p>
        <Link to="/events" className="event-detail__back-link">Retour au catalogue</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail event-detail--error">
        <h1>Erreur de chargement</h1>
        <p>{error}</p>
        <Button onClick={fetchEvent}>Réessayer</Button>
      </div>
    );
  }

  const { title, description, eventDate, location, capacity, bookedCount = 0, category } = event;
  const remaining = getRemainingSeats(capacity, bookedCount);
  const isFull = remaining === 0;
  const status = getCapacityStatus(capacity, bookedCount);
  const showAlert = !isFull && status !== 'success';

  const dateObj = new Date(eventDate);
  const timeStart = formatEventDate(dateObj, { includeTime: true, long: false }).split(' • ')[1] || '';
  const dateOnly = formatEventDate(dateObj, { includeTime: false });

  return (
    <div className="event-detail">
      <nav className="event-detail__breadcrumb" aria-label="Fil d'Ariane">
        <Link to="/">Accueil</Link>
        <span aria-hidden="true">›</span>
        <Link to="/events">Événements</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{title}</span>
      </nav>

      <section className="event-detail__hero">
        <div className="event-detail__visual">
          <CategoryIllustration category={category} className="event-detail__illustration" />
        </div>
        <div className="event-detail__intro">
          <span className="event-detail__category">{category?.toUpperCase()}</span>
          <h1>{title}</h1>
          <ul className="event-detail__meta">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {dateOnly}
            </li>
            {timeStart && (
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {timeStart}
              </li>
            )}
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {location}
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {isFull
                ? 'Complet'
                : `${remaining} places restantes sur ${capacity}`}
            </li>
          </ul>
        </div>
      </section>

      <div className="event-detail__content">
        <div className="event-detail__about">
          <h2>À propos de l'événement</h2>
          <p>{description}</p>
        </div>

        <aside className="event-detail__booking">
          <div className="event-detail__booking-card">
            <h3>Places disponibles</h3>
            <div className="event-detail__booking-count">
              <span className="event-detail__booking-remaining">{remaining}</span>
              <span className="event-detail__booking-separator">/</span>
              <span className="event-detail__booking-total">{capacity}</span>
            </div>
            <ProgressBar capacity={capacity} bookedCount={bookedCount} />
            <dl className="event-detail__booking-stats">
              <div>
                <dt>Capacité maximale</dt>
                <dd>{capacity} places</dd>
              </div>
              <div>
                <dt>Places restantes</dt>
                <dd>{isFull ? 'Complet' : `${remaining} places`}</dd>
              </div>
            </dl>
            <Button
              className="event-detail__book-btn"
              disabled={isFull}
              onClick={() => setModalOpen(true)}
            >
              {isFull ? 'Événement complet' : 'Réserver ma place →'}
            </Button>
            <p className="event-detail__trust">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Réservation simple et sécurisée
            </p>
          </div>
        </aside>
      </div>

      {showAlert && (
        <div className="event-detail__alert" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <p>
            Attention, les places sont limitées ! Réservez dès maintenant pour garantir votre place.
          </p>
        </div>
      )}

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={event}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default EventDetail;
