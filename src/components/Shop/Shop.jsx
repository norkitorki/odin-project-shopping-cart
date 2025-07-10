import styles from './Shop.module.css';
import { useContext, useRef } from 'react';
import { ShopItemsContext } from '../../contexts/ShopItemsContext';
import ShopItemCard from '../ShopItemCard/ShopItemCard';

export default function Shop() {
  const { shopItems, filteredItems, sortItems, filterItems } =
    useContext(ShopItemsContext);
  const sortSelect = useRef(null);
  const items = filteredItems || shopItems;

  const sortShopItems = (event) => {
    const [property, direction] = event.target.value.split('-');
    if (property === 'default') return;

    sortItems(property, direction);
  };

  const filterShopItems = (event) => {
    sortSelect.current.value = 'default';
    filterItems(event.target.value);
  };

  const categories = Object.keys(
    shopItems.reduce((obj, item) => ({ ...obj, [item.category]: null }), {})
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
      <ul className={styles.items}>
        {items.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}
