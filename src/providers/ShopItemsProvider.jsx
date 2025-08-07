import { useCallback, useEffect, useState } from 'react';
import { ShopItemsContext } from '../contexts/ShopItemsContext';
import axios from 'axios';

export default function ShopItemsProvider({ children }) {
  const [shopItems, setShopItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(null);

  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products')
      .then((response) => setShopItems(response.data))
      .catch((error) => console.error(error.message));
  }, []);

  const sortItems = useCallback(
    (property, direction) => {
      setFilteredItems(
        (filteredItems || shopItems).toSorted((a, b) => {
          if (direction === 'desc') [a, b] = [b, a];
          return a[property] <= b[property] ? -1 : 1;
        })
      );
    },
    [filteredItems, shopItems]
  );

  const filterItems = useCallback(
    (category) => {
      if (category === 'default') return setFilteredItems(null);

      setFilteredItems(shopItems.filter((item) => item.category === category));
    },
    [shopItems]
  );

  return (
    <ShopItemsContext
      value={{ shopItems, filteredItems, sortItems, filterItems }}
    >
      {children}
    </ShopItemsContext>
  );
}
