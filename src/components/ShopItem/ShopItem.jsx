import styles from './ShopItem.module.css';
import { useContext } from 'react';
import { useParams } from 'react-router';
import { ShopItemsContext } from '../../contexts/ShopItemsContext';
import ShopItemCard from '../ShopItemCard/ShopItemCard';

export default function ShopItem() {
  const shopItems = useContext(ShopItemsContext);
  const { id } = useParams();
  const item = shopItems.find((ite) => ite.id === Number(id));

  return (
    <div className={styles.wrapper}>
      <ShopItemCard item={item} linkToItem={false} redirectToCart={true} />
    </div>
  );
}
