import fakeShopItems from '../assets/fakeShopItems';
import { useState } from 'react';
import { ShopItemsContext } from '../contexts/ShopItemsContext';

export default function ShopItemsProvider({ children }) {
  const [shopItems, setShopItems] = useState(fakeShopItems);

  const sortItems = (property, direction) => {
    setShopItems(
      shopItems.toSorted((a, b) => {
        if (direction === 'desc') [a, b] = [b, a];
        return a[property] <= b[property] ? -1 : 1;
      })
    );
  };

  return (
    <ShopItemsContext value={{ shopItems, sortItems }}>
      {children}
    </ShopItemsContext>
  );
}
