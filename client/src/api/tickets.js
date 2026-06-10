import apiClient from './client';

const TICKETS_STORAGE_KEY = 'eventbrite_tickets';

export async function bookTicket(eventId, { studentName, studentId }) {
  const { data } = await apiClient.post(`/events/${eventId}/tickets`, {
    studentName,
    studentId,
  });
  return data.data;
}

export async function getTicketsByEvent(eventId) {
  const { data } = await apiClient.get(`/events/${eventId}/tickets`);
  return data.data;
}

export function saveTicketLocally(ticket, event) {
  const stored = getStoredTickets();
  const entry = {
    ...ticket,
    eventSnapshot: {
      _id: event._id,
      title: event.title,
      eventDate: event.eventDate,
      location: event.location,
      category: event.category,
    },
  };
  const exists = stored.some((t) => t.reservationCode === ticket.reservationCode);
  if (!exists) {
    stored.unshift(entry);
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(stored));
  }
  return entry;
}

export function getStoredTickets() {
  try {
    return JSON.parse(localStorage.getItem(TICKETS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getTicketByCode(code) {
  return getStoredTickets().find((t) => t.reservationCode === code) ?? null;
}
