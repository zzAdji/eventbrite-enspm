import apiClient from './client';

// Récupérer la liste des événements à venir (avec filtres optionnels)
export const getEvents = async (params = {}) => {
  try {
    const response = await apiClient.get('/events', { params });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements", error);
    throw error;
  }
};

// Récupérer les détails d'un événement spécifique via son ID
export const getEventById = async (id) => {
  try {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'événement ${id}`, error);
    throw error;
  }
};