import shopItems from '../assets/fakeShopItems';
import { useState } from 'react';
import { ShopItemsContext } from '../contexts/ShopItemsContext';

export default function ShopItemsProvider({ children }) {
  const [filteredItems, setFilteredItems] = useState(null);

  const sortItems = (property, direction) => {
    setFilteredItems(
      (filteredItems || shopItems).toSorted((a, b) => {
        if (direction === 'desc') [a, b] = [b, a];
        return a[property] <= b[property] ? -1 : 1;
      })
    );
  };

  return (
    <ShopItemsContext
      value={{ shopItems, filteredItems, sortItems, filterItems }}
    >
      {children}
    </ShopItemsContext>
  );
}
