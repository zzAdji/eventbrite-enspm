import './EventCardSkeleton.css';

const EventCardSkeleton = () => (
  <article className="event-card-skeleton" aria-hidden="true">
    <div className="event-card-skeleton__media skeleton-shimmer" />
    <div className="event-card-skeleton__body">
      <div className="skeleton-line skeleton-shimmer" style={{ width: '30%' }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '80%', height: 20 }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '100%' }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '90%' }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', marginTop: 16 }} />
    </div>
    <div className="event-card-skeleton__footer">
      <div className="skeleton-line skeleton-shimmer" style={{ width: '40%' }} />
      <div className="skeleton-line skeleton-shimmer" style={{ width: '25%' }} />
    </div>
  </article>
);

export default EventCardSkeleton;
