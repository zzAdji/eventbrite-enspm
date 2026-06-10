import { getCapacityRatio } from '../../utils/capacity';
import './ProgressBar.css';

const ProgressBar = ({ capacity, bookedCount = 0, showLabel = false, className = '' }) => {
  const ratio = getCapacityRatio(capacity, bookedCount);
  const percent = Math.min(100, Math.round(ratio * 100));

  return (
    <div className={`progress-bar ${className}`.trim()} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      {showLabel && (
        <div className="progress-bar__header">
          <span className="progress-bar__label">Places réservées</span>
          <span className="progress-bar__value">{percent}%</span>
        </div>
      )}
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
