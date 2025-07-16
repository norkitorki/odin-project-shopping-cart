import useLocalItems from '../hooks/useLocalItems';
import { useCallback, useState } from 'react';
import { CartItemsContext } from '../contexts/CartItemsContext';

export default function CartItemsProvider({ children }) {
  const { localItems, setLocalItems, removeLocalItems } =
    useLocalItems('cart_items');
  const [cartItems, setCartItems] = useState(localItems);
  const [callbacks, setCallbacks] = useState([]);

  const addCallback = useCallback(
    (name, callback) => {
      if (callbacks.find((cb) => cb.name === name)) return;

      setCallbacks(callbacks.concat([{ name, callback }]));
    },
    [callbacks]
  );

  const removeCallback = useCallback(
    (name) => setCallbacks(callbacks.filter((cb) => cb.name !== name)),
    [callbacks]
  );

  const onUpdate = useCallback(
    (type, item) =>
      callbacks.forEach((cb) => cb.callback.call(null, type, item)),
    [callbacks]
  );

  const total = useCallback(
    () => cartItems.reduce((t, c) => (t += c.quantity * c.price), 0),
    [cartItems]
  );

  const addToCart = useCallback(
    (item, quantity = 1) => {
      if (!item || !quantity || quantity < 1) return;

      const items = [].concat(cartItems);
      const itemIndex = items.findIndex((ite) => ite.id === item.id);
      itemIndex >= 0
        ? (items[itemIndex].quantity += Number(quantity))
        : items.push({ ...item, quantity: Number(quantity) });

      onUpdate('add', item);
      setLocalItems(items);
      setCartItems(items);
    },
    [cartItems, onUpdate, setLocalItems]
  );

  const removeFromCart = useCallback(
    (itemId) => {
      const items = cartItems.filter((item) => item.id !== itemId);

      items.length === 0 ? removeLocalItems() : setLocalItems(items);
      onUpdate('remove', itemId);
      setCartItems(items);
    },
    [cartItems, onUpdate, setLocalItems, removeLocalItems]
  );

  const updateQuantity = useCallback(
    (itemId, newQuantity) => {
      if (newQuantity <= 0) return removeFromCart(itemId);

      const items = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Number(newQuantity) } : item
      );

      setLocalItems(items);
      setCartItems(items);
    },
    [cartItems, removeFromCart, setLocalItems]
  );

  const clearItems = useCallback(() => {
    setCartItems([]);
    removeLocalItems();
    onUpdate('clear', []);
  }, [onUpdate, removeLocalItems]);

  return (
    <CartItemsContext
      value={{
        cartItems,
        addCallback,
        removeCallback,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearItems,
      }}
    >
      {children}
    </CartItemsContext>
  );
}
