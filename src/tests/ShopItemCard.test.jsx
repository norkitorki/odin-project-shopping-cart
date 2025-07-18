import ShopItemCard from '../components/ShopItemCard/ShopItemCard';
import fakeShopItems from '../assets/fakeShopItems';
import userEvent from '@testing-library/user-event';
import CartItemsProvider from '../providers/CartItemsProvider';
import { render, screen } from '@testing-library/react';
import { test, expect, describe } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useContext } from 'react';
import { CartItemsContext } from '../contexts/CartItemsContext';

test('renders item card', () => {
  const shopItem = fakeShopItems[0];

  render(
    <MemoryRouter>
      <ShopItemCard item={shopItem} />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('img', {
      name: shopItem.title,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('link', {
      name: shopItem.title,
    })
  ).toBeInTheDocument();

  expect(screen.getByText(shopItem.description)).toBeInTheDocument();

  expect(
    screen.getByRole('button', {
      name: /add to cart/i,
    })
  ).toBeInTheDocument();
});

describe('when add to cart button is clicked', () => {
  test('redirects to /cart when redirectToCart is truthy', async () => {
    const user = userEvent.setup();
    const shopItem = fakeShopItems[0];

    render(
      <MemoryRouter initialIndex={0} initialEntries={['/shop/item/1']}>
        <Routes>
          <Route
            path="/shop/item/1"
            element={
              <CartItemsProvider>
                <ShopItemCard item={shopItem} redirectToCart={true} />
              </CartItemsProvider>
            }
          />
          <Route path="/cart" element={<h1>Your Shopping Cart</h1>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole('button', {
        name: /add to cart/i,
      })
    );

    expect(
      screen.getByRole('heading', {
        name: /your shopping cart/i,
      })
    ).toBeInTheDocument();
  });

  test('adds item to cart', async () => {
    const user = userEvent.setup();
    const shopItem = fakeShopItems[0];

    const Cart = () => {
      const { cartItems } = useContext(CartItemsContext);

      expect(cartItems[0]).toMatchObject({
        id: shopItem.id,
        title: shopItem.title,
        price: shopItem.price,
        image: shopItem.image,
      });
    };

    render(
      <MemoryRouter initialIndex={0} initialEntries={['/shop/item/1']}>
        <Routes>
          <Route
            path="/shop/item/1"
            element={
              <CartItemsProvider>
                <ShopItemCard item={shopItem} redirectToCart={true} />
              </CartItemsProvider>
            }
          />
          <Route
            path="/cart"
            element={
              <CartItemsProvider>
                <Cart />
              </CartItemsProvider>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole('button', {
        name: /add to cart/i,
      })
    );
  });
});
