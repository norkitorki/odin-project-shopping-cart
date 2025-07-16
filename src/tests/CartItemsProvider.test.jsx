import CartItemsProvider from '../providers/CartItemsProvider';
import { CartItemsContext } from '../contexts/CartItemsContext';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useContext, useEffect } from 'react';

const renderWithProvider = (component) =>
  render(
    <MemoryRouter>
      <CartItemsProvider>{component}</CartItemsProvider>
    </MemoryRouter>
  );

afterEach(() => localStorage.removeItem('cart_items'));

test('adds item to cart', () => {
  const TestComponent = () => {
    const { cartItems, addToCart } = useContext(CartItemsContext);
    const item = { id: 1, title: 'Some Item', price: 2.99 };

    useEffect(() => addToCart(item, 5), []);

    if (cartItems.length > 0) {
      expect(cartItems[0]).toMatchObject(item);
      expect(cartItems[0].quantity).toBe(5);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('returns cart items', () => {
  const TestComponent = () => {
    const { cartItems, addToCart } = useContext(CartItemsContext);
    const firstItem = { id: 1, title: 'Some Item', price: 2.99 };
    const secondItem = { id: 2, title: 'Another Item', price: 4.49 };

    useEffect(() => {
      addToCart(firstItem);
      addToCart(secondItem);
    }, []);

    if (cartItems.length > 1) {
      expect(cartItems).toHaveLength(2);
      expect(cartItems[0]).toMatchObject(firstItem);
      expect(cartItems[1]).toMatchObject(secondItem);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('removes item from cart', () => {
  let itemAdded = false;
  let itemRemoved = false;
  const item = { id: 1, title: 'Test Item', price: 2.99 };

  const TestComponent = () => {
    const { cartItems, addToCart, removeFromCart } =
      useContext(CartItemsContext);

    useEffect(() => {
      if (itemAdded) return;

      itemAdded = true;
      addToCart(item);
    }, []);

    const RemoveComponent = () => {
      useEffect(() => {
        itemRemoved = true;
        removeFromCart(item.id);
      }, []);
    };

    if (itemRemoved) {
      expect(cartItems.find((it) => it.id === item.id)).toBeUndefined();
    }

    if (itemAdded && !itemRemoved) {
      expect(cartItems[0]).toMatchObject(item);
      return <RemoveComponent />;
    }
  };

  renderWithProvider(<TestComponent />);
});

test('updates cart item quantity', () => {
  let itemAdded = false;
  let quantityUpdated = false;
  const item = { id: 1, title: 'Test Item', price: 2.99 };

  const TestComponent = () => {
    const { cartItems, addToCart, updateQuantity } =
      useContext(CartItemsContext);

    useEffect(() => {
      if (itemAdded) return;

      itemAdded = true;
      addToCart(item);
    }, []);

    const UpdateComponent = () => {
      useEffect(() => {
        quantityUpdated = true;
        updateQuantity(item.id, 3);
      }, []);
    };

    if (itemAdded && !quantityUpdated) {
      expect(cartItems[0].quantity).toBe(1);
      return <UpdateComponent />;
    }

    if (quantityUpdated && itemAdded) {
      expect(cartItems[0].quantity).toBe(3);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('removes cart item when quantity is updated to 0', () => {
  let itemAdded = false;
  let quantityUpdated = false;
  const item = { id: 1, title: 'Test Item', price: 2.99 };

  const TestComponent = () => {
    const { cartItems, addToCart, updateQuantity } =
      useContext(CartItemsContext);

    useEffect(() => {
      if (itemAdded) return;

      itemAdded = true;
      addToCart(item);
    }, []);

    const UpdateComponent = () => {
      useEffect(() => {
        quantityUpdated = true;
        updateQuantity(item.id, 0);
      }, []);
    };

    if (itemAdded && !quantityUpdated) {
      expect(cartItems[0].quantity).toBe(1);
      return <UpdateComponent />;
    }

    if (quantityUpdated && itemAdded) {
      expect(cartItems).toHaveLength(0);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('clears cart items', () => {
  let itemAdded = false;
  let itemsCleared = false;
  const item = { id: 1, title: 'Test Item', price: 2.99 };

  const TestComponent = () => {
    const { cartItems, addToCart, clearItems } = useContext(CartItemsContext);

    useEffect(() => {
      if (itemAdded) return;

      itemAdded = true;
      addToCart(item);
    }, []);

    const ClearComponent = () => {
      useEffect(() => {
        itemsCleared = true;
        clearItems();
      }, []);
    };

    if (itemAdded && !itemsCleared) {
      expect(cartItems).toHaveLength(1);
      return <ClearComponent />;
    }

    if (itemsCleared && itemAdded) {
      expect(cartItems).toHaveLength(0);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('returns total', () => {
  const firstItem = { id: 1, title: 'Test Item', price: 2.99 };
  const secondItem = { id: 2, title: 'Another Item', price: 49.95 };
  let itemsAdded = false;

  const TestComponent = () => {
    const { cartItems, addToCart, total } = useContext(CartItemsContext);

    useEffect(() => {
      if (itemsAdded) return;

      addToCart(firstItem, 4);
    }, []);

    const AddItemComponent = () => {
      useEffect(() => {
        itemsAdded = true;
        addToCart(secondItem, 2);
      }, []);
    };

    if (cartItems.length === 1) {
      return <AddItemComponent />;
    }

    if (itemsAdded) {
      expect(total()).toBe(
        firstItem.price * cartItems[0].quantity +
          secondItem.price * cartItems[1].quantity
      );
    }
  };

  renderWithProvider(<TestComponent />);
});

test('registers and calls callbacks', () => {
  const item = { id: 1, title: 'Test Item', price: 2.99 };
  let callbackAdded = false;
  let itemAdded = false;
  let itemsCleared = false;
  let itemRemoved = false;
  const callback = vi.fn();

  const TestComponent = () => {
    const { addToCart, removeFromCart, clearItems, addCallback } =
      useContext(CartItemsContext);

    const AddCallbackComponent = () => {
      useEffect(() => {
        callbackAdded = true;
        addCallback('callback', callback);
      }, []);
    };

    const AddItemComponent = () => {
      useEffect(() => {
        itemAdded = true;
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

    if (!itemAdded && !callbackAdded) {
      return <AddCallbackComponent />;
    }

    if (!itemAdded && callbackAdded) {
      return <AddItemComponent />;
    }

    if (itemAdded && callbackAdded && !itemsCleared) {
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('add', item);
      return <ClearItemsComponent />;
    }

    if (itemAdded && callbackAdded && itemsCleared && !itemRemoved) {
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('clear', []);
      return <RemoveItemComponent />;
    }

    if (itemRemoved) {
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith('remove', item.id);
    }
  };

  renderWithProvider(<TestComponent />);
});

test('removes callbacks', () => {
  const item = { id: 1, title: 'Test Item', price: 2.99 };
  let callbackAdded = false;
  let callbackRemoved = false;
  let itemAdded = false;
  const callback = vi.fn();

  const TestComponent = () => {
    const { addToCart, addCallback, removeCallback } =
      useContext(CartItemsContext);

    const AddCallbackComponent = () => {
      useEffect(() => {
        callbackAdded = true;
        addCallback('callback', callback);
      }, []);
    };

    const RemoveCallbackComponent = () => {
      useEffect(() => {
        callbackRemoved = true;
        removeCallback('callback');
      }, []);
    };

    const AddItemComponent = () => {
      useEffect(() => {
        itemAdded = true;
        addToCart(item);
      }, []);
    };

    if (itemAdded) {
      expect(callback).not.toHaveBeenCalled();
      return;
    }

    if (!itemAdded && !callbackAdded) {
      return <AddCallbackComponent />;
    }

    if (!itemAdded && callbackAdded && !callbackRemoved) {
      return <RemoveCallbackComponent />;
    }

    if (!itemAdded && callbackAdded && callbackRemoved) {
      return <AddItemComponent />;
    }
  };

  renderWithProvider(<TestComponent />);
});
