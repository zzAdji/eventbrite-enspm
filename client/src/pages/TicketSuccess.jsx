import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getTicketByCode } from '../api/tickets';
import { getEventById } from '../api/events';
import { formatEventDate } from '../utils/dates';
import Button from '../components/ui/button';
import './TicketSuccess.css';

const Barcode = ({ value }) => {
  const bars = value.split('').map((char, i) => {
    const code = char.charCodeAt(0);
    const width = (code % 3) + 1;
    return { width, x: i * 4 };
  });

  return (
    <svg className="ticket-barcode" viewBox={`0 0 ${bars.length * 4 + 20} 40`} aria-hidden="true">
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x + 10} y="4" width={bar.width} height="32" fill="#0A0A0A" />
      ))}
    </svg>
  );
};

const TicketSuccess = () => {
  const { code } = useParams();
  const ticketRef = useRef(null);
  const [ticket, setTicket] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = getTicketByCode(code);
    if (!stored) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setTicket(stored);

    const loadEvent = async () => {
      if (stored.eventSnapshot) {
        setEvent(stored.eventSnapshot);
        setLoading(false);
        return;
      }

      try {
        const eventData = await getEventById(stored.eventId);
        setEvent(eventData);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [code]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="ticket-success ticket-success--loading" aria-busy="true">
        <div className="ticket-success__skeleton" />
      </div>
    );
  }

  if (notFound || !ticket || !event) {
    return (
      <div className="ticket-success ticket-success--error">
        <h1>Billet introuvable</h1>
        <p>Ce billet n'existe pas ou a expiré.</p>
        <Link to="/events">Retour au catalogue</Link>
      </div>
    );
  }

  const eventDate = formatEventDate(event.eventDate, { long: true });

  return (
    <div className="ticket-success">
      <div className="ticket-success__header">
        <div className="ticket-success__icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1>Votre billet est prêt !</h1>
        <p>Téléchargez votre billet numérique et préparez-vous à vivre une expérience unique.</p>
      </div>

      <div className="ticket-card" ref={ticketRef}>
        <div className="ticket-card__main">
          <div className="ticket-card__banner">
            <span className="ticket-card__event-title">{event.title}</span>
            <span className="ticket-card__event-sub">{event.category?.toUpperCase()}</span>
          </div>

          <div className="ticket-card__info">
            <div className="ticket-card__row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div>
                <span className="ticket-card__label">Participant</span>
                <span className="ticket-card__value">{ticket.studentName}</span>
              </div>
            </div>
            <div className="ticket-card__row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <div>
                <span className="ticket-card__label">Matricule</span>
                <span className="ticket-card__value">{ticket.studentId}</span>
              </div>
            </div>
            <div className="ticket-card__row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div>
                <span className="ticket-card__label">Date</span>
                <span className="ticket-card__value">{eventDate}</span>
              </div>
            </div>
            <div className="ticket-card__row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <span className="ticket-card__label">Lieu</span>
                <span className="ticket-card__value">{event.location}</span>
              </div>
            </div>
            <div className="ticket-card__row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 15V9C4 7.89543 4.89543 7 6 7H18C19.1046 7 20 7.89543 20 9V15C20 16.1046 19.1046 17 18 17H6C4.89543 17 4 16.1046 4 15Z" />
              </svg>
              <div>
                <span className="ticket-card__label">Code de réservation</span>
                <span className="ticket-card__value ticket-card__code">{ticket.reservationCode}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ticket-card__stub">
          <span className="ticket-card__stub-category">{event.category?.toUpperCase()}</span>
          <h3>{event.title}</h3>
          <dl className="ticket-card__stub-details">
            <div><dt>Date</dt><dd>{formatEventDate(event.eventDate, { includeTime: false })}</dd></div>
            <div><dt>Lieu</dt><dd>{event.location}</dd></div>
            <div><dt>Code</dt><dd>{ticket.reservationCode}</dd></div>
          </dl>
          <div className="ticket-card__qr">
            <QRCodeSVG value={ticket.reservationCode} size={120} level="M" />
          </div>
          <Barcode value={ticket.reservationCode} />
        </div>
      </div>

      <Button className="ticket-success__download" onClick={handleDownload}>
        Télécharger
      </Button>
    </div>
  );
};

export default TicketSuccess;
