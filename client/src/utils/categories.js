export const CATEGORIES = [
  { value: 'Concert', label: 'Musique', tag: '@concert_live', color: '#1E3A8A' },
  { value: 'Conférence', label: 'Conférences', tag: '@conf_tech', color: '#15803D' },
  { value: 'Sport', label: 'Sports', tag: '@sports_fans', color: '#DC2626' },
  { value: 'Atelier', label: 'Ateliers', tag: '@design_workshop', color: '#7C3AED' },
  { value: 'Technologie', label: 'Technologie', tag: '@conf_tech', color: '#0D9488' },
  { value: 'Culture', label: 'Culture', tag: '@music_fest', color: '#CA8A04' },
  { value: 'Design', label: 'Design', tag: '@design_workshop', color: '#9333EA' },
];

export const ALL_CATEGORY = { value: '', label: 'Tous' };

export const FILTER_CATEGORIES = [ALL_CATEGORY, ...CATEGORIES.map(({ value, label }) => ({ value, label }))];

export function getCategoryMeta(category) {
  return CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
}

export function getCategoryDescription(category) {
  const descriptions = {
    Concert: 'Parfait pour les concerts, spectacles et performances musicales.',
    Conférence: 'Idéal pour les conférences, séminaires et talks inspirants.',
    Sport: 'Pour les matchs, tournois et événements sportifs.',
    Atelier: 'Ateliers pratiques, workshops et sessions créatives.',
    Technologie: 'Hackathons, meetups tech et démos produit.',
    Culture: 'Expositions, festivals et événements culturels.',
    Design: 'Sessions design, UX et création visuelle.',
  };
  return descriptions[category] ?? 'Découvrez des expériences uniques.';
}
