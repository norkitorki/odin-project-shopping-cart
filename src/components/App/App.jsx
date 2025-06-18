import { Outlet } from 'react-router';
import CartItemsProvider from '../../providers/CartItemsProvider';
import ShopItemsProvider from '../../providers/ShopItemsProvider';
import Navigation from '../Navigation/Navigation';

export default function App() {
  return (
    <>
      <CartItemsProvider>
        <Navigation />
        <ShopItemsProvider>
          <Outlet />
        </ShopItemsProvider>
      </CartItemsProvider>
    </>
  );
}
