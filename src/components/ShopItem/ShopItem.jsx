import styles from './ShopItem.module.css';
import { useParams } from 'react-router';
import { useShopItems } from '../../hooks/useShopItems';
import ShopItemCard from '../ShopItemCard/ShopItemCard';

export default function ShopItem() {
  const { shopItems } = useShopItems();
  const { id } = useParams();
  const shopItem = shopItems.find((item) => item.id === Number(id));

  if (!shopItem) return;

  return (
    <div className={styles.wrapper}>
      <ShopItemCard item={shopItem} linkToItem={false} redirectToCart={true} />
    </div>
  );
}
