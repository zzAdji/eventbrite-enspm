const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const DAYS_FR = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi',
];

export function formatEventDate(dateInput, options = {}) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  const { includeTime = true, long = false } = options;
  const day = date.getDate();
  const month = MONTHS_FR[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (long) {
    const weekday = DAYS_FR[date.getDay()];
    const base = `${weekday} ${day} ${month} ${year}`;
    return includeTime ? `${base} • ${hours}:${minutes}` : base;
  }

  const base = `${day} ${month} ${year}`;
  return includeTime ? `${base} • ${hours}:${minutes}` : base;
}
