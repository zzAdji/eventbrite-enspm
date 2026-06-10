import { getCategoryMeta } from '../../utils/categories';
import './CategoryIllustration.css';

const CategoryIllustration = ({ category, className = '' }) => {
  const meta = getCategoryMeta(category);

  return (
    <div
      className={`category-illustration category-illustration--${category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')} ${className}`.trim()}
      style={{ '--cat-color': meta.color }}
      aria-hidden="true"
    >
      <div className="category-illustration__scene" />
    </div>
  );
};

export default CategoryIllustration;
