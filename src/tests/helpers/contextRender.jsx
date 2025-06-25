import { render } from '@testing-library/react';
import CartItemsProvider from '../../providers/CartItemsProvider';
import ShopItemsProvider from '../../providers/ShopItemsProvider';

export default function contextRender(component) {
  return render(
    <CartItemsProvider>
      <ShopItemsProvider>{component}</ShopItemsProvider>
    </CartItemsProvider>
  );
}
