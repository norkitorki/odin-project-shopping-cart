import Shop from '../components/Shop/Shop';
import ShopItemsProvider from '../providers/ShopItemsProvider';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '@testing-library/react';
import { test, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { MemoryRouter } from 'react-router';
import { server, shopItems } from './mocks/shopItemsHandler';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders shop items', async () => {
  render(
    <MemoryRouter initialEntries={['/shop']}>
      <ShopItemsProvider>
        <Shop />
      </ShopItemsProvider>
    </MemoryRouter>
  );

  await waitFor(() => {
    const items = within(screen.getByTestId('itemList')).getAllByRole('link');
    items.forEach((item, i) => expect(item.title).toBe(shopItems[i].title));
  });
});

test('filters items by category', async () => {
  const user = userEvent.setup();
  const clothesItemsCount = shopItems.filter(
    (item) => item.category === 'clothes'
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
    await user.selectOptions(filterSelect, 'clothes');
    expect(screen.getByTestId('itemList').children.length).toBe(
      clothesItemsCount
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

  await waitFor(async () => {
    await user.selectOptions(sortSelect, 'title');

    const items = within(screen.getByTestId('itemList')).getAllByRole('link');
    let index = 0;
    for (; index < sortedItems.length; index++) {
      if (sortedItems[index].title !== items[index].title) break;
    }

    expect(index).toBe(sortedItems.length);
  });
});
