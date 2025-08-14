import ShopItemsProvider from '../providers/ShopItemsProvider';
import fakeShopItems from './assets/shopItems';
import axiosMock from './mocks/axiosMock';
import { ShopItemsContext } from '../contexts/ShopItemsContext';
import { expect, test } from 'vitest';
import { act, useContext, useEffect } from 'react';
import { render } from '@testing-library/react';

axiosMock('https://fakestoreapi.com/products', fakeShopItems);

const renderWithProvider = (component) =>
  render(<ShopItemsProvider>{component}</ShopItemsProvider>);

test('returns shop items', async () => {
  expect.assertions(1);

  const TestComponent = () => {
    const { shopItems } = useContext(ShopItemsContext);

    if (shopItems.length > 0) expect(shopItems).toEqual(fakeShopItems);
  };

  await act(() => renderWithProvider(<TestComponent />));
});

test('sorts items in ascending order', async () => {
  expect.assertions(1);

  const TestComponent = () => {
    const { shopItems, filteredItems, sortItems } =
      useContext(ShopItemsContext);

    useEffect(() => {
      if (shopItems.length > 0) sortItems('title');
    }, [shopItems]);

    if (filteredItems) {
      const sortedItems = shopItems.toSorted((a, b) =>
        a.title <= b.title ? -1 : 1
      );

      expect(filteredItems).toEqual(sortedItems);
    }
  };

  await act(() => renderWithProvider(<TestComponent />));
});

test('sorts items in descending order', async () => {
  expect.assertions(1);

  const TestComponent = () => {
    const { shopItems, filteredItems, sortItems } =
      useContext(ShopItemsContext);

    useEffect(() => {
      if (shopItems.length > 0) sortItems('title', 'desc');
    }, [shopItems]);

    if (filteredItems) {
      const sortedItems = shopItems.toSorted((a, b) =>
        b.title <= a.title ? -1 : 1
      );

      expect(filteredItems).toEqual(sortedItems);
    }
  };

  await act(() => renderWithProvider(<TestComponent />));
});

test('filters items based on category', async () => {
  expect.assertions(1);

  const TestComponent = () => {
    const { shopItems, filteredItems, filterItems } =
      useContext(ShopItemsContext);

    useEffect(() => {
      if (shopItems.length > 0) filterItems('electronics');
    }, [shopItems]);

    if (filteredItems) {
      const electronicItems = shopItems.filter(
        (item) => item.category === 'electronics'
      );

      expect(filteredItems).toEqual(electronicItems);
    }
  };

  await act(() => renderWithProvider(<TestComponent />));
});
