import styles from './ShoppingCart.module.css';
import { useContext } from 'react';
import { CartItemsContext } from '../../contexts/CartItemsContext';
import { Link } from 'react-router';
import { XCircle } from 'feather-icons-react';

export default function ShoppingCart() {
  const { cartItems, total, updateQuantity, removeFromCart, clearItems } =
    useContext(CartItemsContext);

  if (cartItems.length <= 0) {
    return <h1 className={styles.heading}>Your Shopping Cart is empty</h1>;
  }

  const clearCart = () => clearItems();
  const checkout = () => {
    if (confirm(`Would you like to pay a total of $${total.toFixed(2)}?`)) {
      alert('Thank you for your purchase!');
      clearItems();
    }
  };

  return (
    <>
      <h1 className={styles.heading}>Your Shopping Cart</h1>
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
                <Link to={`/shop/item/${item.id}`} className={styles.itemLink}>
                  <img src={item.image} className={styles.itemImage}></img>
                  <span>{item.title}</span>
                </Link>
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min={0}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                  className={styles.quantity}
                />
              </td>
              <td>${(item.quantity * item.price).toFixed(2)}</td>
              <td>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeButton}
                  title={`Remove '${item.title}' from cart`}
                >
                  <XCircle />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}></td>
            <th>Total</th>
          </tr>
          <tr>
            <td colSpan={2}>
              <button
                onClick={clearCart}
                title="Clear cart items"
                className={styles.clearButton}
              >
                Clear Cart
              </button>
              <button onClick={checkout} className={styles.checkoutButton}>
                To Checkout
              </button>
            </td>
            <td>${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
