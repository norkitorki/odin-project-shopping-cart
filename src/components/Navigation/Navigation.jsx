import styles from './Navigation.module.css';
import { NavLink, useLocation } from 'react-router';
import CartDropdown from '../CartDropdown/CartDropdown';

export default function Navigation() {
  const activeLink = ({ isActive }) => (isActive ? styles.activeLink : '');
  const location = useLocation();

  return (
    <nav className={styles.navigation}>
      <NavLink to="/" className={activeLink}>
        Home
      </NavLink>
      <NavLink to="shop" className={activeLink}>
        Shop
      </NavLink>
      {!['/', '/cart'].includes(location.pathname) && <CartDropdown />}
    </nav>
  );
}
