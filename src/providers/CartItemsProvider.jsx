import { useState } from 'react';
import { CartItemsContext } from '../contexts/CartItemsContext';
import useLocalItems from '../hooks/useLocalItems';

export default function CartItemsProvider({ children }) {
  const { localItems, setLocalItems, removeLocalItems } = useLocalItems();
  const [cartItems, setCartItems] = useState(localItems);

  const addToCart = (item, quantity = 1) => {
    if (!item || !quantity || quantity < 1) return;

    const items = [].concat(cartItems);
    const itemIndex = items.findIndex((ite) => ite.id === item.id);
    itemIndex >= 0
      ? (items[itemIndex].quantity += Number(quantity))
      : items.push({ ...item, quantity: Number(quantity) });

    setLocalItems(items);
    setCartItems(items);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(itemId);

    const items = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Number(newQuantity) } : item
    );

    setLocalItems(items);
    setCartItems(items);
  };

  const removeFromCart = (itemId) => {
    const items = cartItems.filter((item) => item.id !== itemId);

    items.length === 0 ? removeLocalItems() : setLocalItems(items);
    setCartItems(items);
  };

  return (
    <CartItemsContext
      value={{ cartItems, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartItemsContext>
  );
}
