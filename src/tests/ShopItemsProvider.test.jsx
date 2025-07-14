import ShopItemsProvider from '../providers/ShopItemsProvider';
import fakeShopItems from '../assets/fakeShopItems';
import { ShopItemsContext } from '../contexts/ShopItemsContext';
import { expect, test } from 'vitest';
import { useContext, useEffect } from 'react';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';

const renderWithProvider = (component) =>
  render(
    <MemoryRouter>
      <ShopItemsProvider>{component}</ShopItemsProvider>
    </MemoryRouter>
  );

test('returns shop items', () => {
  const TestComponent = () => {
    const { shopItems } = useContext(ShopItemsContext);

    expect(shopItems).toBe(fakeShopItems);
  };

  renderWithProvider(<TestComponent />);
});

test('sorts items in ascending order', () => {
  const TestComponent = () => {
    const { shopItems, filteredItems, sortItems } =
      useContext(ShopItemsContext);

    useEffect(() => sortItems('price'), []);

    if (filteredItems) {
      const sortedItems = shopItems.toSorted((a, b) =>
        a.price <= b.price ? -1 : 1
      );

      let index = 0;
      for (; index < sortedItems.length; index++) {
        if (sortedItems[index].id !== filteredItems[index].id) break;
      }

      expect(index).toBe(sortedItems.length);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('sorts items in descending order', () => {
  const TestComponent = () => {
    const { shopItems, filteredItems, sortItems } =
      useContext(ShopItemsContext);

    useEffect(() => sortItems('title', 'desc'), []);

    if (filteredItems) {
      const sortedItems = shopItems.toSorted((a, b) =>
        b.title <= a.title ? -1 : 1
      );

      let index = 0;
      for (; index < sortedItems.length; index++) {
        if (sortedItems[index].id !== filteredItems[index].id) break;
      }

      expect(index).toBe(sortedItems.length);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('filters items based on category', () => {
  const TestComponent = () => {
    const { shopItems, filteredItems, filterItems } =
      useContext(ShopItemsContext);

    useEffect(() => filterItems('jewelery'), []);

    if (filteredItems) {
      const jeweleryItems = shopItems.filter(
        (item) => item.category === 'jewelery'
      );

      expect(jeweleryItems.length).toBe(filteredItems.length);
      jeweleryItems.forEach((jeweleryItem) => {
        expect(
          filteredItems.find((item) => jeweleryItem.id === item.id)
        ).toBeTruthy();
      });
    }
  };

  renderWithProvider(<TestComponent />);
});
