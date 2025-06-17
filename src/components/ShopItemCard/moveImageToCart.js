import { clonedImage } from './ShopItemCard.module.css';

export default function moveImageToCart(itemImage) {
  if (!itemImage) return;

  const clone = document.createElement('img');
  const rect = itemImage.getBoundingClientRect();
  clone.src = itemImage.src;
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.classList.value = clonedImage;
  document.body.appendChild(clone);

  clone.style.transform = `translate(${outerWidth - rect.x + rect.width}px, ${-(
    scrollY + rect.y
  )}px)`;
  clone.style.opacity = '0';

  setTimeout(() => clone.remove(), 800);
}
