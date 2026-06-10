import { Link } from 'react-router-dom';
import Button from '../components/ui/button';
import CategoryIllustration from '../components/events/CategoryIllustration';
import { CATEGORIES } from '../utils/categories';
import './HomePage.css';

const HERO_CATEGORIES = [
  CATEGORIES[0],
  CATEGORIES[1],
  CATEGORIES[5],
  CATEGORIES[2],
  CATEGORIES[3],
];

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-hero__title">Vivez les moments qui vous passionnent.</h1>
        <p className="home-hero__subtitle">
          La billetterie premium pour des expériences inoubliables.
        </p>

        <div className="home-hero__cards" aria-hidden="true">
          {HERO_CATEGORIES.map((cat, index) => (
            <div
              key={cat.value}
              className="home-hero__card"
              style={{ '--card-index': index, '--cat-color': cat.color }}
            >
              <span className="home-hero__tag" style={{ backgroundColor: cat.color }}>
                {cat.tag}
              </span>
              <div className="home-hero__card-image">
                <CategoryIllustration category={cat.value} />
              </div>
            </div>
          ))}
        </div>

        <div className="home-hero__cta">
          <p className="home-hero__description">
            Accédez à une sélection exclusive d&apos;événements marquants. Réservez simplement,
            sécurisez vos places et profitez de moments uniques.
          </p>
          <div className="home-hero__actions">
            <Link to="/events">
              <Button variant="primary">Découvrir les Événements</Button>
            </Link>
            <Link to="/events">
              <Button variant="secondary">En savoir plus</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
