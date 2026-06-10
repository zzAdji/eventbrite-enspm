import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import ProgressBar from '../components/events/ProgressBar';
import { getRemainingSeats } from '../utils/capacity';
import { formatEventDate } from '../utils/dates';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState(null);

  const selectedEvent = events.find((e) => e._id === selectedId);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_URL}/events`, { params: { limit: 50 } });
      const list = data.data?.events ?? [];
      setEvents(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0]._id);
      }
    } catch {
      setError('Impossible de charger les événements.');
    } finally {
      setLoadingEvents(false);
    }
  }, [selectedId]);

  const fetchTickets = useCallback(async (eventId) => {
    if (!eventId) return;
    setLoadingTickets(true);
    try {
      const { data } = await axios.get(`${API_URL}/events/${eventId}/tickets`);
      setTickets(data.data ?? []);
    } catch {
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedId) fetchTickets(selectedId);
  }, [selectedId, fetchTickets]);

  if (loadingEvents) {
    return (
      <div className="dashboard dashboard--loading" aria-busy="true">
        <div className="dashboard-skeleton skeleton-shimmer" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-state dashboard-state--error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchEvents}>Réessayer</button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Tableau de bord</h1>
          <p>Suivez les inscriptions à vos événements.</p>
        </header>
        <div className="dashboard-state dashboard-state--empty">
          <h2>Aucun événement</h2>
          <p>Créez un événement pour commencer à suivre les inscriptions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Suivez les inscriptions à vos événements.</p>
      </header>

      <div className="dashboard-selector">
        <label htmlFor="event-select">Événement</label>
        <select
          id="event-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div className="dashboard-overview">
          <div className="dashboard-overview__info">
            <h2>{selectedEvent.title}</h2>
            <p>{formatEventDate(selectedEvent.eventDate)} · {selectedEvent.location}</p>
          </div>

          <div className="dashboard-capacity-card">
            <div className="dashboard-capacity-card__header">
              <h3>Places disponibles</h3>
              <span className="dashboard-capacity-card__count">
                {getRemainingSeats(selectedEvent.capacity, selectedEvent.bookedCount)}
                <span> / {selectedEvent.capacity}</span>
              </span>
            </div>
            <ProgressBar
              capacity={selectedEvent.capacity}
              bookedCount={selectedEvent.bookedCount}
            />
            <ul className="dashboard-capacity-card__stats">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                Capacité maximale : {selectedEvent.capacity} places
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9z" />
                  <path d="M8 12h8" />
                </svg>
                Places restantes : {getRemainingSeats(selectedEvent.capacity, selectedEvent.bookedCount)} places
              </li>
            </ul>
          </div>
        </div>
      )}

      <section className="dashboard-tickets" aria-labelledby="tickets-heading">
        <h3 id="tickets-heading">
          Inscriptions
          {!loadingTickets && ` (${tickets.length})`}
        </h3>

        {loadingTickets ? (
          <div className="dashboard-tickets__loading" aria-busy="true">Chargement des inscriptions…</div>
        ) : tickets.length === 0 ? (
          <p className="dashboard-tickets__empty">Aucune inscription pour le moment.</p>
        ) : (
          <div className="dashboard-tickets__table-wrapper">
            <table className="dashboard-tickets__table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Matricule</th>
                  <th>Code</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.studentName}</td>
                    <td>{ticket.studentId}</td>
                    <td><code>{ticket.reservationCode}</code></td>
                    <td>{formatEventDate(ticket.bookingDate, { includeTime: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
