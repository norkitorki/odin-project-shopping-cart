import styles from './ShopItem.module.css';
import { useContext } from 'react';
import { useParams } from 'react-router';
import { ShopItemsContext } from '../../contexts/ShopItemsContext';
import ShopItemCard from '../ShopItemCard/ShopItemCard';

export default function ShopItem() {
  const { shopItems } = useContext(ShopItemsContext);
  const { id } = useParams();
  const shopItem = shopItems.find((item) => item.id === Number(id));

  return (
    <div className={styles.wrapper}>
      <ShopItemCard item={shopItem} linkToItem={false} redirectToCart={true} />
    </div>
  );
}
