import styles from './CartDropdown.module.css';
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { CartItemsContext } from '../../contexts/CartItemsContext';
import { ShoppingCart as ShoppingCartIcon } from 'feather-icons-react';

export default function CartDropdown() {
  const { cartItems, total } = useContext(CartItemsContext);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (['/', '/cart'].includes(location.pathname)) return;

  const itemCount = cartItems.length;
  const expand = () => itemCount > 0 && setExpanded(true);
  const retract = () => setExpanded(false);
  const navigateToCart = (event) =>
    event.target.nodeName !== 'A' && navigate('/cart') && retract();

  return (
    <button
      className={styles.trigger}
      title={itemCount <= 0 ? 'Your Cart is empty' : null}
      aria-expanded={expanded}
      onClick={navigateToCart}
      onMouseEnter={expand}
      onMouseLeave={retract}
      onFocus={expand}
      onBlur={retract}
    >
      <ShoppingCartIcon strokeWidth="2.5" fill={itemCount > 0 ? 'green' : ''} />
      <ul
        className={`${styles.dropdown} ${expanded && styles.menuExtended}`}
        onClick={retract}
      >
        <li>
          {itemCount} Item{itemCount !== 1 && 's'}
        </li>
        {cartItems.map((item) => (
          <li key={item.id}>
            <Link to={`/shop/item/${item.id}`} className={styles.itemLink}>
              <img src={item.image} />
              {item.title}
            </Link>{' '}
            x {item.quantity}
            <hr width="90%" />
          </li>
        ))}
        <li>{total.toFixed(2)}$</li>
      </ul>
    </button>
  );
}
