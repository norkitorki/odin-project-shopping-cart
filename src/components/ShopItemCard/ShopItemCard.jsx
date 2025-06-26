import styles from './ShopItemCard.module.css';
import { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { CartItemsContext } from '../../contexts/CartItemsContext';
import moveImageToCart from './moveImageToCart.js';

export default function ShopItemCard({
  item,
  linkToItem = true,
  redirectToCart = false,
}) {
  const itemImage = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartItemsContext);

  const onClick = () => {
    addToCart(
      { id: item.id, title: item.title, price: item.price, image: item.image },
      1
    );
    if (redirectToCart) return navigate('/cart');

    moveImageToCart(itemImage.current);
  };

  const TitleContent = (
    <>
      <img
        src={item.image}
        className={styles.itemImage}
        alt={item.title}
        ref={itemImage}
      />
      <p className={styles.itemTitle}>{item.title}</p>
    </>
  );

  return (
    <article key={item.id} className={styles.wrapper}>
      {linkToItem ? (
        <Link
          to={`/shop/item/${item.id}`}
          title={item.title}
          className={styles.itemLink}
          aria-label={item.title}
        >
          {TitleContent}
        </Link>
      ) : (
        <div className={styles.itemLink}>{TitleContent}</div>
      )}
      <p className={styles.itemDescription}>{item.description}</p>
      <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
      <button className={styles.addButton} onClick={onClick}>
        Add to Cart
      </button>
    </article>
  );
}
