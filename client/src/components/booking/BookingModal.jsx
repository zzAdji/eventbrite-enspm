import React, { useState } from 'react';

const BookingModal = ({ isOpen, onClose, onSubmit, eventTitle, isLoading }) => {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim()) return;
    
    // On transmet les données saisies au composant parent
    onSubmit({ studentName, studentId });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalBox}>
        <div style={styles.header}>
          <h3 style={styles.title}>Réserver une place</h3>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>
        
        <p style={styles.subtitle}>Événement : <strong>{eventTitle}</strong></p>

        <form onSubmit={handleFormSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nom complet de l'étudiant</label>
            <input
              type="text"
              placeholder="Ex: Djenabou ..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Matricule universitaire</label>
            <input
              type="text"
              placeholder="Ex: 22A000EG"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              disabled={isLoading}
              style={styles.input}
            />
          </div>

          <div style={styles.actions}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading} 
              style={styles.cancelBtn}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !studentName.trim() || !studentId.trim()} 
              style={styles.submitBtn}
            >
              {isLoading ? 'Réservation...' : 'Confirmer la réservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles basiques en ligne respectant le Design System (Neutral Premium)
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#0A0A0A',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#3A3A3C',
  },
  subtitle: {
    fontSize: '14px',
    color: '#3A3A3C',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#3A3A3C',
  },
  input: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #D1D1D6',
    fontSize: '15px',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '12px 20px',
    borderRadius: '100px',
    border: '1.5px solid #D1D1D6',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
  },
  submitBtn: {
    padding: '12px 20px',
    borderRadius: '100px',
    border: 'none',
    backgroundColor: '#0A0A0A',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default BookingModal;