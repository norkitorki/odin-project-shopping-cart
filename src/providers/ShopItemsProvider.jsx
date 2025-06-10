import fakeShopItems from '../assets/fakeShopItems';
import { ShopItemsContext } from '../contexts/ShopItemsContext';

export default function ShopItemsProvider({ children }) {
  return <ShopItemsContext value={fakeShopItems}>{children}</ShopItemsContext>;
}
