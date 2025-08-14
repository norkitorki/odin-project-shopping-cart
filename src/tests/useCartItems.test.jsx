import { useCartItems } from '../hooks/useCartItems';
import { ClearCartItems } from './helpers/cartItemsHelper';
import { render } from '@testing-library/react';
import { afterAll, beforeEach, expect, test, vi } from 'vitest';
import { useEffect } from 'react';

beforeEach(() => render(<ClearCartItems />));
afterAll(() => render(<ClearCartItems />));

test('adds item to cart', () => {
  expect.assertions(2);

  const TestComponent = () => {
    const { cartItems, addToCart } = useCartItems();
    const item = { id: 1, title: 'Some Item', price: 2.99 };

    useEffect(() => addToCart(item, 5), []);

    if (cartItems.length > 0) {
      expect(cartItems[0]).toMatchObject(item);
      expect(cartItems[0].quantity).toBe(5);
    }
  };

  render(<TestComponent />);
});

test('returns cart items', () => {
  expect.assertions(4);

  const firstItem = { id: 1, title: 'First Item', price: 1.49 };
  const secondItem = { id: 2, title: 'Another Item', price: 4.49 };

  const TestComponent = () => {
    const { cartItems, addToCart } = useCartItems();

    useEffect(() => {
      addToCart(firstItem);
      addToCart(secondItem);
    }, []);

    if (cartItems.length > 1) {
      expect(Array.isArray(cartItems)).toBeTruthy();
      expect(cartItems).toHaveLength(2);
      expect(cartItems[0]).toMatchObject(firstItem);
      expect(cartItems[1]).toMatchObject(secondItem);
    }
  };

  render(<TestComponent />);
});

test('removes item from cart', () => {
  expect.assertions(2);

  let itemAdded = false;
  let itemRemoved = false;

  const TestComponent = () => {
    const { cartItems, addToCart, removeFromCart } = useCartItems();

    useEffect(() => {
      if (!itemAdded) {
        itemAdded = true;
        addToCart({ id: 1, title: 'Item', price: 1.49 });
      }

      itemRemoved = true;
      removeFromCart(1);
    }, []);

    if (itemAdded && itemRemoved) {
      expect(cartItems.find((item) => item.id === 1)).toBeUndefined();
      expect(cartItems).toHaveLength(0);
    }
  };

  render(<TestComponent />);
});

test('updates cart item quantity', () => {
  expect.assertions(2);

  let itemAdded = false;
  let quantityUpdated = false;

  const TestComponent = () => {
    const { cartItems, addToCart, updateQuantity } = useCartItems();

    useEffect(() => {
      itemAdded = true;
      addToCart({ id: 3, title: 'Item', price: 2.49 });
    }, []);

    const UpdateComponent = () => {
      useEffect(() => {
        quantityUpdated = true;
        updateQuantity(3, 3);
      }, []);
    };

    if (itemAdded && !quantityUpdated) {
      expect(cartItems[0].quantity).toBe(1);
      return <UpdateComponent />;
    }

    if (quantityUpdated && itemAdded) expect(cartItems[0].quantity).toBe(3);
  };

  render(<TestComponent />);
});

test('removes cart item when quantity is updated to 0', () => {
  expect.assertions(2);

  let itemAdded = false;
  let quantityUpdated = false;

  const TestComponent = () => {
    const { cartItems, addToCart, updateQuantity } = useCartItems();

    useEffect(() => {
      if (!itemAdded) {
        itemAdded = true;
        addToCart({ id: 1, title: 'Test Item', price: 2.99 });
      }
    }, []);

    const UpdateComponent = () => {
      useEffect(() => {
        quantityUpdated = true;
        updateQuantity(1, 0);
      }, []);
    };

    if (itemAdded && !quantityUpdated) {
      expect(cartItems).toHaveLength(1);
      return <UpdateComponent />;
    }

    if (itemAdded && quantityUpdated) expect(cartItems).toHaveLength(0);
  };

  render(<TestComponent />);
});

test('clears cart items', () => {
  expect.assertions(2);

  let itemsAdded = false;
  let itemsCleared = false;
  const items = [1, 2, 3, 4].map((i) => ({
    id: i,
    title: `Item ${i}`,
    price: i + 0.99,
  }));

  const TestComponent = () => {
    const { cartItems, addToCart, clearItems } = useCartItems();

    useEffect(() => {
      if (!itemsAdded) {
        itemsAdded = true;
        items.forEach((item) => addToCart(item));
      }
    }, []);

    const ClearComponent = () => {
      useEffect(() => {
        itemsCleared = true;
        clearItems();
      }, []);
    };

    if (itemsAdded && !itemsCleared) {
      expect(cartItems).toHaveLength(4);
      return <ClearComponent />;
    }

    if (itemsAdded && itemsCleared) {
      expect(cartItems).toHaveLength(0);
    }
  };

  render(<TestComponent />);
});

test('returns total', () => {
  expect.assertions(1);

  let itemsAdded = false;
  const firstItem = { id: 1, title: 'Test Item', price: 9.99 };
  const secondItem = { id: 2, title: 'Another Item', price: 49.95 };

  const TestComponent = () => {
    const { addToCart, total } = useCartItems();

    useEffect(() => {
      if (!itemsAdded) {
        itemsAdded = true;
        addToCart(firstItem, 4);
        addToCart(secondItem, 2);
      }
    }, []);

    if (itemsAdded) expect(total()).toBe(139.86);
  };

  render(<TestComponent />);
});

test('registers callbacks', () => {
  expect.assertions(6);

  const item = { id: 1, title: 'Test Item', price: 2.99 };
  let callbackAdded = false;
  let itemsCleared = false;
  let itemRemoved = false;
  const callback = vi.fn();

  const TestComponent = () => {
    const { addToCart, removeFromCart, clearItems, addCallback } =
      useCartItems();

    const AddCallbackComponent = () => {
      useEffect(() => {
        callbackAdded = true;
        addCallback('callback', callback);
        addToCart(item);
      }, []);
    };

    const ClearItemsComponent = () => {
      useEffect(() => {
        itemsCleared = true;
        clearItems();
      }, []);
    };

    const RemoveItemComponent = () => {
      useEffect(() => {
        itemRemoved = true;
        removeFromCart(item.id);
      }, []);
    };

    if (!callbackAdded) return <AddCallbackComponent />;

    if (callbackAdded && !itemsCleared) {
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('add', item);
      return <ClearItemsComponent />;
    }

    if (callbackAdded && itemsCleared && !itemRemoved) {
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('clear', []);
      return <RemoveItemComponent />;
    }

    if (itemRemoved) {
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith('remove', item.id);
    }
  };

  render(<TestComponent />);
});

test('removes callbacks', () => {
  expect.assertions(1);

  let callbackAdded = false;
  let callbackRemoved = false;
  let itemAdded = false;
  const callback = vi.fn();

  const TestComponent = () => {
    const { addToCart, addCallback, removeCallback } = useCartItems();

    useEffect(() => {
      if (!itemAdded && !callbackAdded) {
        callbackAdded = true;
        addCallback('callback', callback);
      }
    }, []);

    const RemoveCallbackComponent = () => {
      useEffect(() => {
        callbackRemoved = true;
        removeCallback('callback');
      }, []);
    };

    const AddItemComponent = () => {
      useEffect(() => {
        itemAdded = true;
        addToCart({ id: 1, title: 'Test Item', price: 2.99 });
      }, []);
    };

    if (itemAdded) {
      expect(callback).not.toHaveBeenCalled();
      return;
    }

    if (!itemAdded && callbackAdded && !callbackRemoved) {
      return <RemoveCallbackComponent />;
    }

    if (!itemAdded && callbackAdded && callbackRemoved) {
      return <AddItemComponent />;
    }
  };

  render(<TestComponent />);
});
