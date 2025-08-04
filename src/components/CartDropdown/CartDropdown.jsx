import styles from './CartDropdown.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useCartItems } from '../../hooks/useCartItems';
import { ShoppingCart as ShoppingCartIcon } from 'feather-icons-react';

export default function CartDropdown({ excludedPaths = [] }) {
  const { cartItems, addCallback, total } = useCartItems();
  const [toggleAllItems, setToggleAllItems] = useState(false);
  const location = useLocation();
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const timeout = useRef(null);

  const extend = useCallback(() => {
    dropdown.current.classList.add(styles.menuExtended);
    trigger.current.setAttribute('aria-expanded', true);
  }, []);

  const retract = useCallback(() => {
    dropdown.current.classList.remove(styles.menuExtended);
    trigger.current.setAttribute('aria-expanded', false);
  }, []);

  const toggleDropdown = useCallback(() => {
    clearTimeout(timeout.current);
    dropdown.current.classList.contains(styles.menuExtended)
      ? retract()
      : extend();
  }, [extend, retract]);

  const toggleVisibleItems = useCallback(() => {
    clearTimeout(timeout.current);
    setToggleAllItems(!toggleAllItems);
  }, [toggleAllItems]);

  useEffect(() => {
    addCallback('openDropdown', (type) => {
      if (type !== 'add') return;

      clearTimeout(timeout.current);
      timeout.current = setTimeout(retract, 5000);
      extend();
    });
    return () => clearTimeout(timeout.current);
  }, [addCallback, extend, retract]);

  if (excludedPaths.includes(location.pathname)) return;

  const items = toggleAllItems ? cartItems : cartItems.slice(0, 5);
  const itemCount = cartItems.length;

  return (
    <>
      <button
        ref={trigger}
        className={`${styles.cartTrigger} ${
          (itemCount > 0 && styles.cartFilled) || ''
        }`}
        title={
          itemCount <= 0 ? 'Your Cart is empty' : `${itemCount} items in cart`
        }
        aria-expanded={false}
        onClick={toggleDropdown}
      >
        <ShoppingCartIcon className={styles.cartIcon} />
      </button>
      <div ref={dropdown} className={styles.dropdown} data-testid={'dropdown'}>
        <Link to={'/cart'} className={styles.cartLink}>
          Go To Cart
        </Link>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to={`/shop/item/${item.id}`}
                className={styles.itemLink}
                onClick={retract}
              >
                <img src={item.image} />
                {item.title}
              </Link>{' '}
              <span className={styles.quantity}>{item.quantity}</span>
              <hr width="90%" />
            </li>
          ))}
        </ul>
        {itemCount > 5 && (
          <button onClick={toggleVisibleItems} className={styles.toggleVisible}>
            {toggleAllItems ? 'Hide' : 'Show'} {itemCount - 5} more items
          </button>
        )}
        <p className={styles.total}>${total().toFixed(2)}</p>
      </div>
    </>
  );
}
