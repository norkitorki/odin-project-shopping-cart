import styles from './Navigation.module.css';
import { NavLink } from 'react-router';

export default function Navigation() {
  const activeLink = ({ isActive }) => (isActive ? styles.activeLink : '');

  return (
    <nav className={styles.navigation}>
      <NavLink to="/" className={activeLink}>
        Home
      </NavLink>
      <NavLink to="shop" className={activeLink}>
        Shop
      </NavLink>
    </nav>
  );
}
