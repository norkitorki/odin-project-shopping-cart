import ShopItem from '../components/ShopItem/ShopItem';
import contextRender from './helpers/contextRender';
import fakeShopItems from '../assets/fakeShopItems';
import { screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { createRoutesStub, MemoryRouter } from 'react-router';

test('renders shop item', () => {
  const ShopItemStub = createRoutesStub([
    { path: '/shop/item/:id', Component: ShopItem },
  ]);
  const shopItem = fakeShopItems[0];

  contextRender(
    <ShopItemStub initialEntries={[`/shop/item/${shopItem.id}`]} />
  );

  expect(screen.getByText(shopItem.title)).toBeInTheDocument();
  expect(screen.getByText(shopItem.description)).toBeInTheDocument();
});
