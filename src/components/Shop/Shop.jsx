import styles from './Shop.module.css';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { ShopItemsContext } from '../../contexts/ShopItemsContext';
import ShopItemCard from '../ShopItemCard/ShopItemCard';

export default function Shop() {
  const { shopItems, filteredItems, sortItems, filterItems } =
    useContext(ShopItemsContext);
  const sortSelect = useRef(null);
  const items = filteredItems || shopItems;

  const sortShopItems = useCallback(
    (event) => {
      const [property, direction] = event.target.value.split('-');
      if (property === 'default') return;

      sortItems(property, direction);
    },
    [sortItems]
  );

  const filterShopItems = useCallback(
    (event) => {
      sortSelect.current.value = 'default';
      filterItems(event.target.value);
    },
    [filterItems]
  );

  const categories = useMemo(
    () =>
      Object.keys(
        shopItems.reduce((obj, item) => ({ ...obj, [item.category]: null }), {})
      ),
    [shopItems]
  );

  const shopItemCards = useMemo(
    () => items.map((item) => <ShopItemCard key={item.id} item={item} />),
    [items]
  );

  return (
    <>
      <div className={styles.selectWrapper}>
        <select onChange={filterShopItems} className={styles.selectInput}>
          <option defaultChecked value="default">
            All Categories
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category[0].toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <select
          onChange={sortShopItems}
          ref={sortSelect}
          className={styles.selectInput}
        >
          <option defaultChecked value="default">
            Sort by
          </option>
          <option value="title">Title ASC</option>
          <option value="title-desc">Title DESC</option>
          <option value="price">Price ASC</option>
          <option value="price-desc">Price DESC</option>
        </select>
      </div>
      <div className={styles.items} data-testid="itemList">
        {shopItemCards}
      </div>
    </>
  );
}
