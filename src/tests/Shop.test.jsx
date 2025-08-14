import Shop from '../components/Shop/Shop';
import ShopItemsProvider from '../providers/ShopItemsProvider';
import shopItems from './assets/shopItems';
import axiosMock from './mocks/axiosMock';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '@testing-library/react';
import { test, expect } from 'vitest';
import { MemoryRouter } from 'react-router';

axiosMock('https://fakestoreapi.com/products', shopItems);

test('renders shop items', async () => {
  render(
    <MemoryRouter initialEntries={['/shop']}>
      <ShopItemsProvider>
        <Shop />
      </ShopItemsProvider>
    </MemoryRouter>
  );

  const items = await within(screen.getByTestId('itemList')).findAllByRole(
    'link'
  );

  items.forEach((item, i) => expect(item.title).toBe(shopItems[i].title));
});

test('filters items by category', async () => {
  const user = userEvent.setup();
  const electronicsItemsCount = shopItems.filter(
    (item) => item.category === 'electronics'
  ).length;

  render(
    <MemoryRouter initialEntries={['/shop']}>
      <ShopItemsProvider>
        <Shop />
      </ShopItemsProvider>
    </MemoryRouter>
  );

  const filterSelect = screen.getByRole('option', {
    name: 'All Categories',
  }).parentElement;

  await waitFor(async () => {
    await user.selectOptions(filterSelect, 'electronics');
    expect(screen.getByTestId('itemList').children.length).toBe(
      electronicsItemsCount
    );
  });
});

test('sorts items', async () => {
  const user = userEvent.setup();
  const sortedItems = shopItems.toSorted((a, b) =>
    a.title <= b.title ? -1 : 1
  );

  render(
    <MemoryRouter initialEntries={['/shop']}>
      <ShopItemsProvider>
        <Shop />
      </ShopItemsProvider>
    </MemoryRouter>
  );

  const sortSelect = screen.getByRole('option', {
    name: 'Sort by',
  }).parentElement;

  await waitFor(async () => await user.selectOptions(sortSelect, 'title'));

  const items = await within(screen.getByTestId('itemList')).findAllByRole(
    'link'
  );

  let index = 0;
  for (; index < sortedItems.length; index++) {
    if (sortedItems[index].title !== items[index].title) break;
  }

  expect(index).toBe(sortedItems.length);
});
