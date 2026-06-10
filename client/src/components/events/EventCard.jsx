import { Link } from 'react-router-dom';
import { formatEventDate } from '../../utils/dates';
import { getCapacityStatus, formatSeatsLabel, getRemainingSeats } from '../../utils/capacity';
import { getCategoryMeta } from '../../utils/categories';
import CategoryIllustration from './CategoryIllustration';
import './EventCard.css';

const EventCard = ({ event, popular = false }) => {
  const {
    _id,
    title,
    description,
    eventDate,
    location,
    capacity,
    bookedCount = 0,
    category,
  } = event;

  const status = getCapacityStatus(capacity, bookedCount);
  const remaining = getRemainingSeats(capacity, bookedCount);
  const isPopular = popular || (remaining > 0 && remaining / capacity < 0.25);
  const meta = getCategoryMeta(category);

  return (
    <article className="event-card">
      <div className="event-card__media">
        <CategoryIllustration category={category} />
        {isPopular && (
          <span className="event-card__badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
            Populaire
          </span>
        )}
      </div>

      <div className="event-card__body">
        <span className="event-card__category" style={{ color: meta.color }}>
          {category}
        </span>
        <h3 className="event-card__title">{title}</h3>
        <p className="event-card__description">{description}</p>

        <ul className="event-card__meta">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatEventDate(eventDate)}
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </li>
        </ul>
      </div>

      <footer className="event-card__footer">
        <span className={`event-card__seats event-card__seats--${status}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          {formatSeatsLabel(capacity, bookedCount)}
        </span>
        <Link to={`/events/${_id}`} className="event-card__link">
          Voir les détails
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </footer>
    </article>
  );
};

export default EventCard;
