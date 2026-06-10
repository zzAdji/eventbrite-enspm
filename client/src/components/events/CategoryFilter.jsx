import { FILTER_CATEGORIES } from '../../utils/categories';
import './CategoryFilter.css';

const CategoryFilter = ({ selected = '', onChange, className = '' }) => {
  return (
    <div className={`category-filter ${className}`.trim()} role="group" aria-label="Filtrer par catégorie">
      {FILTER_CATEGORIES.map(({ value, label }) => {
        const isActive = selected === value;
        return (
          <button
            key={value || 'all'}
            type="button"
            className={`category-filter__pill ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
