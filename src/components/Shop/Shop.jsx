import styles from './Shop.module.css';
import { useContext } from 'react';
import { ShopItemsContext } from '../../contexts/ShopItemsContext';
import ShopItemCard from '../ShopItemCard/ShopItemCard';

export default function Shop() {
  const { shopItems, sortItems } = useContext(ShopItemsContext);

  const sortShopItems = (event) =>
    sortItems.apply(this, event.target.value.split('-'));

  return (
    <div className={styles.wrapper}>
      <label className={styles.sortLabel}>
        Sort Items By
        <select onChange={sortShopItems}>
          <option selected />
          <option value="title">Title ASC</option>
          <option value="title-desc">Title DESC</option>
          <option value="price">Price ASC</option>
          <option value="price-desc">Price DESC</option>
        </select>
      </label>
      <ul className={styles.items}>
        {shopItems.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
