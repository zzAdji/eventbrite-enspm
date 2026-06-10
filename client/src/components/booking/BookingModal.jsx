import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/input';
import Button from '../ui/button';
import { bookTicket, saveTicketLocally } from '../../api/tickets';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, event, onSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentName: '', studentId: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setForm({ studentName: '', studentId: '' });
      setErrors({});
      setApiError(null);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !event) return null;

  const validate = () => {
    const next = {};
    if (!form.studentName.trim()) next.studentName = 'Le nom est requis';
    if (!form.studentId.trim()) next.studentId = 'Le matricule est requis';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setApiError(null);

    try {
      const ticket = await bookTicket(event._id, {
        studentName: form.studentName.trim(),
        studentId: form.studentId.trim(),
      });
      saveTicketLocally(ticket, event);
      onSuccess?.(ticket);
      onClose();
      navigate(`/ticket/${ticket.reservationCode}`);
    } catch (err) {
      if (err.code === 'EVENT_FULL') {
        setApiError('Cet événement est complet. Aucune place disponible.');
      } else {
        setApiError(err.message || 'La réservation a échoué. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={loading ? undefined : onClose} role="presentation">
      <div
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="booking-modal__header">
          <h2 id="booking-modal-title">Réserver ma place</h2>
          <button
            type="button"
            className="booking-modal__close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fermer"
          >
            ×
          </button>
        </header>

        <p className="booking-modal__event">{event.title}</p>

        <form onSubmit={handleSubmit} className="booking-modal__form" noValidate>
          <Input
            label="Nom complet"
            id="studentName"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Ex : Marie Dupont"
            error={errors.studentName}
            disabled={loading}
            autoComplete="name"
          />

          <Input
            label="Matricule"
            id="studentId"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            placeholder="Ex : MRT-2024-56789"
            error={errors.studentId}
            disabled={loading}
            autoComplete="off"
          />

          {apiError && (
            <p className="booking-modal__error" role="alert">{apiError}</p>
          )}

          <div className="booking-modal__actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              Confirmer la réservation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
