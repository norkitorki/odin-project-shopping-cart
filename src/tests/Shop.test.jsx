import Shop from '../components/Shop/Shop';
import ShopItemsProvider from '../providers/ShopItemsProvider';
import userEvent from '@testing-library/user-event';
import shopItems from '../assets/fakeShopItems';
import { render, screen, within } from '@testing-library/react';
import { test, expect } from 'vitest';
import { MemoryRouter } from 'react-router';

test('renders shop items', () => {
  render(
    <MemoryRouter initialEntries={['/shop']}>
      <ShopItemsProvider>
        <Shop />
      </ShopItemsProvider>
    </MemoryRouter>
  );

  const items = within(screen.getByTestId('itemList')).getAllByRole('link');

  items.forEach((item, i) => expect(item.title).toBe(shopItems[i].title));
});

test('filters items by category', async () => {
  const user = userEvent.setup();
  const jeweleryItemsCount = shopItems.filter(
    (item) => item.category === 'jewelery'
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

  await user.selectOptions(filterSelect, 'jewelery');

  expect(screen.getByTestId('itemList').children.length).toBe(
    jeweleryItemsCount
  );
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

  await user.selectOptions(sortSelect, 'title');

  const items = within(screen.getByTestId('itemList')).getAllByRole('link');

  let index = 0;
  for (; index < sortedItems.length; index++) {
    if (sortedItems[index].title !== items[index].title) break;
  }

  expect(index).toBe(sortedItems.length);
});
