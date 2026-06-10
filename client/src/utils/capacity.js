/**
 * Calcule les places restantes et le statut d'affichage.
 * Le serveur reste la source de vérité — ces helpers servent uniquement à l'UI.
 */
export function getRemainingSeats(capacity, bookedCount = 0) {
  return Math.max(0, capacity - bookedCount);
}

export function getCapacityRatio(capacity, bookedCount = 0) {
  if (!capacity || capacity <= 0) return 0;
  return bookedCount / capacity;
}

/** @returns {'success' | 'warning' | 'danger' | 'full'} */
export function getCapacityStatus(capacity, bookedCount = 0) {
  const remaining = getRemainingSeats(capacity, bookedCount);
  if (remaining === 0) return 'full';
  const ratio = remaining / capacity;
  if (ratio > 0.3) return 'success';
  if (ratio > 0.1) return 'warning';
  return 'danger';
}

export function formatSeatsLabel(capacity, bookedCount = 0) {
  const remaining = getRemainingSeats(capacity, bookedCount);
  if (remaining === 0) return 'Complet';
  return `${remaining} / ${capacity} places restantes`;
}
