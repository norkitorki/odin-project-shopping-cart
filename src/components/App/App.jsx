import CartItemsProvider from '../../providers/CartItemsProvider';
import ShopItemsProvider from '../../providers/ShopItemsProvider';
import Navigation from '../Navigation/Navigation';
import CartDropdown from '../CartDropdown/CartDropdown';
import { Outlet } from 'react-router';

export default function App() {
  return (
    <>
      <Navigation />
      <CartItemsProvider>
        <CartDropdown excludedPaths={['/', '/cart']} />
        <ShopItemsProvider>
          <Outlet />
        </ShopItemsProvider>
      </CartItemsProvider>
    </>
  );
}
