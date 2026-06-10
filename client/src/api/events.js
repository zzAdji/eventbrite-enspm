import apiClient from './client';

export async function getEvents(params = {}) {
  const { data } = await apiClient.get('/events', { params });
  return data.data;
}

export async function getEventById(id) {
  const { data } = await apiClient.get(`/events/${id}`);
  return data.data;
}

export async function createEvent(eventData) {
  const { data } = await apiClient.post('/events', eventData);
  return data.data;
}
