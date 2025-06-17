import styles from './Shop.module.css';
import { useContext } from 'react';
import { ShopItemsContext } from '../../contexts/ShopItemsContext';
import ShopItemCard from '../ShopItemCard/ShopItemCard';

export default function Shop() {
  const shopItems = useContext(ShopItemsContext);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.items}>
        {shopItems.map((item) => (
          <ShopItemCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
