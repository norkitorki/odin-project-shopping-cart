import { useContext } from 'react';
import { ShopItemsContext } from '../contexts/ShopItemsContext';

export const useShopItems = () => useContext(ShopItemsContext);
