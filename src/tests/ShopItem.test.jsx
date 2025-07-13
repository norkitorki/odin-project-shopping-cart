import ShopItem from '../components/ShopItem/ShopItem';
import shopItems from '../assets/fakeShopItems';
import ShopItemsProvider from '../providers/ShopItemsProvider';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { createRoutesStub } from 'react-router';

test('renders shop item', () => {
  const ShopItemStub = createRoutesStub([
    { path: '/shop/item/:id', Component: ShopItem },
  ]);
  const shopItem = shopItems[0];

  <ShopItemsProvider></ShopItemsProvider>;

  render(
    <ShopItemsProvider>
      <ShopItemStub initialEntries={[`/shop/item/${shopItem.id}`]} />
    </ShopItemsProvider>
  );

  expect(screen.getByText(shopItem.title)).toBeInTheDocument();
  expect(screen.getByText(shopItem.description)).toBeInTheDocument();
});
