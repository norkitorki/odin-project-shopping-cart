import { createBrowserRouter } from 'react-router';
import App from './components/App/App';
import Home from './components/Home/Home';
import Shop from './components/Shop/Shop';
import ShopItem from './components/ShopItem/ShopItem';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import ErrorPage from './components/ErrorPage/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/item/:id', element: <ShopItem /> },
      { path: 'cart', element: <ShoppingCart /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
