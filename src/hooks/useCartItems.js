import { useContext } from 'react';
import { CartItemsContext } from '../contexts/CartItemsContext';

export const useCartItems = () => useContext(CartItemsContext);
