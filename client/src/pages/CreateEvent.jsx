import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './CreateEvent.css';

const CATEGORIES = [
  { value: '', label: 'Choisissez une catégorie' },
  { value: 'Concert', label: 'Concert' },
  { value: 'Conférence', label: 'Conférence' },
  { value: 'Sport', label: 'Sport' },
  { value: 'Atelier', label: 'Atelier' },
  { value: 'Technologie', label: 'Technologie' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Design', label: 'Design' },
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    category: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (!formData.eventDate) newErrors.eventDate = 'La date est requise';
    if (!formData.location) newErrors.location = 'Le lieu est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'La capacité doit être au moins 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Simulate API call for now (FE-Lead task doesn't wire the final API)
      // The API call will be done by FE-Dev 2 or integrated later
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Event created:', formData);
      navigate('/events');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <header className="create-event-header">
        <h1>Créer un événement</h1>
        <p>Remplissez les informations ci-dessous pour créer votre événement.</p>
      </header>

      <div className="create-event-content">
        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            <Input
              id="title"
              label="Titre de l'événement"
              placeholder="Ex : Summer Vibes Concert"
              helperText="Donnez un titre clair et attractif à votre événement."
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              maxLength={120}
            />

            <Input
              id="description"
              as="textarea"
              label="Description"
              placeholder="Décrivez votre événement, le programme, les intervenants..."
              helperText={`${formData.description.length} / 500`}
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              maxLength={500}
            />

            <div className="form-row">
              <Input
                id="eventDate"
                type="date"
                label="Date"
                value={formData.eventDate}
                onChange={handleChange}
                error={errors.eventDate}
              />
              <Input
                id="eventTime"
                type="time"
                label="Heure (optionnel)"
                value={formData.eventTime}
                onChange={handleChange}
              />
            </div>

            <Input
              id="location"
              label="Lieu"
              placeholder="Ex : Amphi 300"
              helperText="Indiquez le lieu exact de votre événement."
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              maxLength={80}
            />

            <Input
              id="category"
              as="select"
              label="Catégorie"
              options={CATEGORIES}
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            />

            <Input
              id="capacity"
              type="number"
              label="Capacité maximale"
              placeholder="Ex : 200"
              helperText="Nombre total de places disponibles."
              value={formData.capacity}
              onChange={handleChange}
              error={errors.capacity}
              min={1}
            />
          </div>

          <div className="form-actions">
            <Button variant="secondary" type="button" disabled={loading}>
              Enregistrer en brouillon
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Créer l'événement
            </Button>
          </div>
        </form>

        <aside className="create-event-preview">
          <h3>Aperçu de la catégorie</h3>
          <div className="preview-card">
            <div className="preview-image">
              {formData.category ? (
                <div className="placeholder-image">
                  <span>Image {formData.category}</span>
                </div>
              ) : (
                <div className="placeholder-image empty">
                  <span>Sélectionnez une catégorie</span>
                </div>
              )}
            </div>
            <div className="preview-badge">
              {formData.category || 'Catégorie'}
            </div>
            <p className="preview-desc">
              Parfait pour les concerts, spectacles et performances musicales.
            </p>
            <Button variant="secondary" type="button" className="btn-change-cat">
              Changer de catégorie
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateEvent;
