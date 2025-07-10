import shopItems from '../assets/fakeShopItems';
import { useCallback, useState } from 'react';
import { ShopItemsContext } from '../contexts/ShopItemsContext';

export default function ShopItemsProvider({ children }) {
  const [filteredItems, setFilteredItems] = useState(null);

  const sortItems = useCallback(
    (property, direction) => {
      setFilteredItems(
        (filteredItems || shopItems).toSorted((a, b) => {
          if (direction === 'desc') [a, b] = [b, a];
          return a[property] <= b[property] ? -1 : 1;
        })
      );
    },
    [filteredItems]
  );

  const filterItems = useCallback((category) => {
    if (category === 'default') return setFilteredItems(null);

    setFilteredItems(shopItems.filter((item) => item.category === category));
  }, []);

  return (
    <ShopItemsContext
      value={{ shopItems, filteredItems, sortItems, filterItems }}
    >
      {children}
    </ShopItemsContext>
  );
}
