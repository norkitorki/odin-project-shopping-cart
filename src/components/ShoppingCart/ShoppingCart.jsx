import styles from './ShoppingCart.module.css';
import { Link } from 'react-router';
import { useCartItems } from '../../hooks/useCartItems';
import { XCircle, Minus, Plus } from 'feather-icons-react';

const ItemLink = ({ item }) => (
  <Link to={`/shop/item/${item.id}`} className={styles.itemLink}>
    <img src={item.image} className={styles.itemImage} />
    <span>{item.title}</span>
  </Link>
);

const ItemQuantity = ({ item, updateQuantity }) => {
  const changeQuantity = (id, quantity) => () => updateQuantity(id, quantity);

  return (
    <div className={styles.quantityWrapper}>
      <button
        className={styles.quantitySelector}
        onClick={changeQuantity(item.id, item.quantity - 1)}
        title="Decrease quantity"
      >
        <Minus />
      </button>
      <input
        disabled
        type="text"
        value={item.quantity}
        min={0}
        className={styles.quantityDisplay}
      />
      <button
        className={styles.quantitySelector}
        onClick={changeQuantity(item.id, item.quantity + 1)}
        title="Increase quantity"
      >
        <Plus />
      </button>
    </div>
  );
};

const RemoveItemButton = ({ item, removeFromCart }) => {
  const removeItem = () => removeFromCart(item.id);

  return (
    <button
      onClick={removeItem}
      className={styles.removeButton}
      title={`Remove '${item.title}' from cart`}
    >
      <XCircle />
    </button>
  );
};

export default function ShoppingCart() {
  const { cartItems, total, updateQuantity, removeFromCart, clearItems } =
    useCartItems();

  const itemCount = cartItems.length;

  if (itemCount <= 0) {
    return <h1 className={styles.heading}>Your Shopping Cart is empty</h1>;
  }

  const toPay = total();

  const checkout = () => {
    if (confirm(`Would you like to pay a total of $${toPay.toFixed(2)}?`)) {
      alert('Thank you for your purchase!');
      clearItems();
    }
  };

  return (
    <>
      <h1 className={styles.heading}>Your Shopping Cart ({itemCount})</h1>
      <table className={styles.itemTable}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>
                <ItemLink item={item} />
              </td>
              <td>
                <ItemQuantity item={item} updateQuantity={updateQuantity} />
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <RemoveItemButton item={item} removeFromCart={removeFromCart} />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}></td>
            <th>Total</th>
          </tr>
          <tr>
            <td colSpan={2} />
            <td>${toPay.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <table className={`${styles.itemTable} ${styles.narrowItemTable}`}>
        {cartItems.map((item) => (
          <tbody key={item.id}>
            <tr>
              <td colSpan={2}>
                <ItemLink item={item} />
              </td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>
                <ItemQuantity item={item} updateQuantity={updateQuantity} />
              </td>
            </tr>
            <tr>
              <th>Price</th>
              <td>${item.price.toFixed(2)}</td>
            </tr>
            <tr className={styles.lastRow}>
              <td colSpan={2}>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.narrowRemoveButton}
                  title={`Remove '${item.title}' from cart`}
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        ))}
        <tfoot>
          <tr>
            <th>Total</th>
            <td>${toPay.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div className={styles.actionButtons}>
        <button
          onClick={clearItems}
          className={styles.clearButton}
          title="Clear cart items"
        >
          Clear Cart
        </button>
        <button onClick={checkout} className={styles.checkoutButton}>
          To Checkout
        </button>
      </div>
    </>
  );
}
