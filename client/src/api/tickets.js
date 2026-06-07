import apiClient from './client';

// Créer une réservation (Ticket) pour un événement
export const bookTicket = async (eventId, ticketData) => {
  try {
    // ticketData contiendra { studentName, studentId }
    const response = await apiClient.post(`/events/${eventId}/tickets`, ticketData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la réservation du billet", error);
    throw error;
  }
};