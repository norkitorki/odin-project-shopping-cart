import { useEffect } from 'react';
import { useCartItems } from '../../hooks/useCartItems';

export const ClearCartItems = () => {
  const { clearItems } = useCartItems();

  useEffect(() => clearItems(), [clearItems]);
};

export const PopulateCartItems = ({ items = [] }) => {
  const { addToCart } = useCartItems();

  useEffect(() => items.forEach((item) => addToCart(item, item.quantity)), []);
};
