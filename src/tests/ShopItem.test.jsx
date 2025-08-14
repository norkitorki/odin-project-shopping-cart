import ShopItem from '../components/ShopItem/ShopItem';
import ShopItemsProvider from '../providers/ShopItemsProvider';
import shopItems from './assets/shopItems';
import axiosMock from './mocks/axiosMock';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { createRoutesStub } from 'react-router';
import { act } from 'react';

axiosMock('https://fakestoreapi.com/products', shopItems);

test('renders shop item', async () => {
  const ShopItemStub = createRoutesStub([
    { path: '/shop/item/:id', Component: ShopItem },
  ]);
  const shopItem = shopItems[0];

  await act(() =>
    render(
      <ShopItemsProvider>
        <ShopItemStub
          initialIndex={0}
          initialEntries={[`/shop/item/${shopItem.id}`]}
        />
      </ShopItemsProvider>
    )
  );

  expect(screen.getByText(shopItem.title)).toBeInTheDocument();
  expect(screen.getByText(shopItem.description)).toBeInTheDocument();
});
