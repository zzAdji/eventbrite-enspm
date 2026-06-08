import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TicketSuccess = () => {
  const { code } = useParams(); // Récupère le code de réservation unique depuis l'URL
  const navigate = useNavigate();
  const [ticketInfo, setTicketInfo] = useState(null);

  useEffect(() => {
    // Récupération des informations du billet sauvegardées localement
    const savedTickets = JSON.parse(localStorage.getItem('my_tickets') || '[]');
    const currentTicket = savedTickets.find(t => t.reservationCode === code);
    
    if (currentTicket) {
      setTicketInfo(currentTicket);
    }
  }, [code]);

  return (
    <div style={styles.container}>
      <div style={styles.successHeader}>
        <div style={styles.iconCircle}>✓</div>
        <h2 style={styles.successTitle}>Réservation Confirmée !</h2>
        <p style={styles.successSubtitle}>Votre billet numérique est prêt. Présentez-le le jour de l'événement.</p>
      </div>

      {/* Le Billet d'Événement Style Premium */}
      <div style={styles.ticketCard}>
        <div style={styles.ticketMain}>
          <span style={styles.univBadge}>UNIVERSITÉ DE MAROUA - ENSPM</span>
          <h1 style={styles.eventTitle}>{ticketInfo?.eventTitle || "Billet d'Accès"}</h1>
          
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.label}>Étudiant</span>
              <span style={styles.value}>{ticketInfo?.studentName || "Nom Participant"}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.label}>Matricule</span>
              <span style={styles.value}>{ticketInfo?.studentId || "Non spécifié"}</span>
            </div>
          </div>
        </div>

        {/* Ligne de Découpe Pointillée */}
        <div style={styles.ticketDivider}>
          <div style={styles.notchLeft}></div>
          <div style={styles.dashedLine}></div>
          <div style={styles.notchRight}></div>
        </div>

        {/* Partie Coupon de contrôle */}
        <div style={styles.ticketStub}>
          <span style={styles.codeLabel}>Code de Réservation</span>
          <span style={styles.codeValue}>{code}</span>
          
          <div style={styles.qrPlaceholder}>
            {/* Box visuelle du ticket en attendant la dépendance QR */}
            <span style={{ fontSize: '12px', color: '#8E8E93' }}>[ Code Unique : {code} ]</span>
          </div>
          <span style={styles.miniCaption}>Scannez pour valider l'entrée</span>
        </div>
      </div>

      <div style={styles.actions}>
        <button onClick={() => window.print()} style={styles.printBtn}>
          Imprimer ou Capturer
        </button>
        <button onClick={() => navigate('/')} style={styles.homeBtn}>
          Retour au Catalogue
        </button>
      </div>
    </div>
  );
};

// Styles du Billet (Design System Neutral Premium)
const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    backgroundColor: '#34C759',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 16px auto',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0A0A0A',
    margin: '0 0 8px 0',
  },
  successSubtitle: {
    fontSize: '14px',
    color: '#3A3A3C',
    lineHeight: '1.4',
    margin: 0,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #D1D1D6',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  ticketMain: {
    padding: '28px',
    backgroundColor: '#FFFFFF',
  },
  univBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#5856D6',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0A0A0A',
    margin: '12px 0 24px 0',
    lineHeight: '1.2',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '11px',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  value: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0A0A0A',
  },
  ticketDivider: {
    position: 'relative',
    height: '20px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
  },
  notchLeft: {
    width: '20px',
    height: '20px',
    backgroundColor: '#F8F8FA',
    borderRadius: '50%',
    position: 'absolute',
    left: '-10px',
    borderRight: '1px solid #D1D1D6',
  },
  notchRight: {
    width: '20px',
    height: '20px',
    backgroundColor: '#F8F8FA',
    borderRadius: '50%',
    position: 'absolute',
    right: '-10px',
    borderLeft: '1px solid #D1D1D6',
  },
  dashedLine: {
    width: '100%',
    borderBottom: '2px dashed #D1D1D6',
    margin: '0 12px',
  },
  ticketStub: {
    padding: '24px 28px 28px 28px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  codeLabel: {
    fontSize: '11px',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  codeValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#5856D6',
    letterSpacing: '2px',
    margin: '6px 0 16px 0',
  },
  qrPlaceholder: {
    padding: '30px',
    backgroundColor: '#F8F8FA',
    borderRadius: '12px',
    border: '1px dashed #D1D1D6',
    display: 'inline-block',
    marginBottom: '8px',
    width: '130px',
    height: '130px',
    boxSizing: 'border-box',
  },
  miniCaption: {
    fontSize: '11px',
    color: '#8E8E93',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    marginTop: '32px',
  },
  printBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0A0A0A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '100px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  homeBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#3A3A3C',
    border: '1.5px solid #D1D1D6',
    borderRadius: '100px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default TicketSuccess;