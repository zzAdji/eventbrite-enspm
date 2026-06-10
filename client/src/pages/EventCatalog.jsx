import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/events/EventCard';
import EventCardSkeleton from '../components/events/EventCardSkeleton';
import CategoryFilter from '../components/events/CategoryFilter';
import './EventCatalog.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PAGE_SIZE = 6;

const EventCatalog = () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (category) params.category = category;
      if (search) params.search = search;

      const { data } = await axios.get(`${API_URL}/events`, { params });
      let fetched = data.data?.events ?? [];

      if (sortBy === 'title') {
        fetched = [...fetched].sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'date') {
        fetched = [...fetched].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      }

      setEvents(fetched);
      setPagination(data.data?.pagination ?? { page: 1, totalPages: 1, total: fetched.length });
    } catch {
      setError('Impossible de charger les événements. Vérifiez votre connexion et réessayez.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, page, sortBy]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const { totalPages } = pagination;
    if (totalPages <= 1) return null;

    const pages = [];
    const current = page;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - 1 && i <= current + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return (
      <nav className="catalog-pagination" aria-label="Pagination du catalogue">
        <button
          type="button"
          className="catalog-pagination__btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
        >
          ‹
        </button>
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="catalog-pagination__ellipsis">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`catalog-pagination__btn ${p === page ? 'is-active' : ''}`}
              onClick={() => handlePageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          className="catalog-pagination__btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Page suivante"
        >
          ›
        </button>
      </nav>
    );
  };

  return (
    <div className="event-catalog">
      <header className="catalog-header">
        <div className="catalog-header__text">
          <h1>Tous les événements</h1>
          <p>Explorez les expériences qui vous inspirent.</p>
        </div>
        <div className="catalog-header__illustration" aria-hidden="true">
          <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="15" width="50" height="60" rx="6" fill="#E8E8F5" stroke="#5856D6" strokeWidth="2" />
            <rect x="25" y="25" width="30" height="4" rx="2" fill="#5856D6" opacity="0.4" />
            <rect x="25" y="35" width="20" height="4" rx="2" fill="#5856D6" opacity="0.3" />
            <rect x="60" y="30" width="45" height="70" rx="8" fill="#F2F2F7" stroke="#D1D1D6" strokeWidth="2" />
            <rect x="70" y="45" width="25" height="35" rx="4" fill="#5856D6" opacity="0.15" />
          </svg>
        </div>
      </header>

      <div className="catalog-toolbar">
        <div className="catalog-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Rechercher un événement, un thème, un lieu..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Rechercher un événement"
          />
        </div>
        <button type="button" className="catalog-filters-btn" aria-label="Filtres avancés">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          Filtres
        </button>
      </div>

      <div className="catalog-controls">
        <CategoryFilter selected={category} onChange={handleCategoryChange} />
        <div className="catalog-sort">
          <label htmlFor="sort-select">Trier par :</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Plus récents</option>
            <option value="date">Date</option>
            <option value="title">Titre</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="catalog-state catalog-state--error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchEvents}>Réessayer</button>
        </div>
      )}

      {loading && (
        <div className="catalog-grid" aria-busy="true" aria-label="Chargement des événements">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="catalog-state catalog-state--empty">
          <h2>Aucun événement trouvé</h2>
          <p>Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="catalog-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {renderPagination()}
    </div>
  );
};

export default EventCatalog;
