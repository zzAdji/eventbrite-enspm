import { Link } from 'react-router-dom';
import { getStoredTickets } from '../api/tickets';
import { formatEventDate } from '../utils/dates';
import './MyTickets.css';

const MyTickets = () => {
  const tickets = getStoredTickets();

  return (
    <div className="my-tickets">
      <header className="my-tickets__header">
        <h1>Mes billets</h1>
        <p>Retrouvez ici tous vos billets réservés sur EVENTBRITE.</p>
      </header>

      {tickets.length === 0 ? (
        <div className="my-tickets__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 15V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V15C20 16.1046 19.1046 17 18 17H6C4.89543 17 4 16.1046 4 15Z" />
          </svg>
          <h2>Aucun billet pour le moment</h2>
          <p>Explorez le catalogue et réservez votre première place.</p>
          <Link to="/events" className="my-tickets__cta">Découvrir les événements</Link>
        </div>
      ) : (
        <ul className="my-tickets__list">
          {tickets.map((ticket) => {
            const event = ticket.eventSnapshot;
            if (!event) return null;

            return (
              <li key={ticket.reservationCode} className="my-ticket-item">
                <div className="my-ticket-item__info">
                  <span className="my-ticket-item__category">{event.category}</span>
                  <h3>{event.title}</h3>
                  <p className="my-ticket-item__meta">
                    {formatEventDate(event.eventDate)} · {event.location}
                  </p>
                  <p className="my-ticket-item__participant">
                    {ticket.studentName} · {ticket.studentId}
                  </p>
                </div>
                <div className="my-ticket-item__actions">
                  <span className="my-ticket-item__code">{ticket.reservationCode}</span>
                  <Link to={`/ticket/${ticket.reservationCode}`} className="my-ticket-item__link">
                    Voir le billet →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyTickets;
