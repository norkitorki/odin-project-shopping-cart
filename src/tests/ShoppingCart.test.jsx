import ShoppingCart from '../components/ShoppingCart/ShoppingCart';
import CartItemsProvider from '../providers/CartItemsProvider';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach, describe } from 'vitest';
import { MemoryRouter } from 'react-router';

test('renders heading when shopping cart is empty', () => {
  render(
    <MemoryRouter>
      <CartItemsProvider>
        <ShoppingCart />
      </CartItemsProvider>
    </MemoryRouter>
  );

  expect(
    screen.getByRole('heading', {
      name: /your shopping cart is empty/i,
    })
  ).toBeInTheDocument();
});

describe('when shopping cart is populated', () => {
  const cartItems = [
    { id: 1, title: 'Test Item', price: 2.99, image: null, quantity: 2 },
    { id: 2, title: 'Another Item', price: 4.95, image: null, quantity: 1 },
  ];

  beforeEach(() =>
    localStorage.setItem('cart_items', JSON.stringify(cartItems))
  );
  afterEach(() => localStorage.removeItem('cart_items'));

  test('renders heading', () => {
    render(
      <MemoryRouter>
        <CartItemsProvider initialItems={cartItems}>
          <ShoppingCart />
        </CartItemsProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /^your shopping cart$/i,
      })
    ).toBeInTheDocument();
  });

  test('renders cart items', () => {
    render(
      <MemoryRouter>
        <CartItemsProvider initialItems={cartItems}>
          <ShoppingCart />
        </CartItemsProvider>
      </MemoryRouter>
    );

    const firstItem = screen.getByRole('row', { name: /test item 2 \$2\.99/i });
    const secondItem = screen.getByRole('row', {
      name: /another item 1 \$4\.95/i,
    });

    expect(firstItem).toBeInTheDocument();
    expect(
      within(firstItem).getByRole('link', { name: /test item/i })
    ).toBeInTheDocument();

    expect(
      within(firstItem).getByRole('button', {
        name: /decrease quantity/i,
      })
    ).toBeInTheDocument();
    expect(
      within(firstItem).getByRole('button', {
        name: /increase quantity/i,
      })
    ).toBeInTheDocument();

    expect(secondItem).toBeInTheDocument();
    expect(
      within(secondItem).getByRole('link', { name: /another item/i })
    ).toBeInTheDocument();

    expect(
      within(secondItem).getByRole('button', {
        name: /decrease quantity/i,
      })
    ).toBeInTheDocument();
    expect(
      within(secondItem).getByRole('button', {
        name: /increase quantity/i,
      })
    ).toBeInTheDocument();
  });

  test('updates cart item quantity', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartItemsProvider initialItems={cartItems}>
          <ShoppingCart />
        </CartItemsProvider>
      </MemoryRouter>
    );

    const itemRow = screen.getByRole('row', { name: /test item 2 \$2\.99/i });
    const quantityDisplay = within(itemRow).getByRole('textbox');

    expect(quantityDisplay).toHaveValue('2');
    await user.click(
      within(itemRow).getByRole('button', {
        name: /increase quantity/i,
      })
    );
    expect(quantityDisplay).toHaveValue('3');
  });

  test('removes item from cart', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartItemsProvider initialItems={cartItems}>
          <ShoppingCart />
        </CartItemsProvider>
      </MemoryRouter>
    );

    const itemRow = screen.getByRole('row', { name: /test item 2 \$2\.99/i });

    expect(itemRow).toBeInTheDocument();
    await user.click(
      within(itemRow).getByRole('button', {
        name: `Remove 'Test Item' from cart`,
      })
    );
    expect(itemRow).not.toBeInTheDocument();
  });

  test('removes item from cart when quantity hits 0', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartItemsProvider initialItems={cartItems}>
          <ShoppingCart />
        </CartItemsProvider>
      </MemoryRouter>
    );

    const itemRow = screen.getByRole('row', {
      name: /another item 1 \$4\.95/i,
    });
    const decreaseButton = within(itemRow).getByRole('button', {
      name: /decrease quantity/i,
    });

    await user.click(decreaseButton);

    expect(itemRow).not.toBeInTheDocument();
  });

  test('clears cart items', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartItemsProvider initialItems={cartItems}>
          <ShoppingCart />
        </CartItemsProvider>
      </MemoryRouter>
    );

    const firstItem = screen.getByRole('row', { name: /test item 2 \$2\.99/i });
    const secondItem = screen.getByRole('row', {
      name: /another item 1 \$4\.95/i,
    });

    await user.click(screen.getByRole('button', { name: /clear cart/i }));

    expect(
      screen.getByRole('heading', {
        name: /your shopping cart is empty/i,
      })
    ).toBeInTheDocument();
    expect(firstItem).not.toBeInTheDocument();
    expect(secondItem).not.toBeInTheDocument();
  });

  test('checks out the cart', async () => {
    const user = userEvent.setup();
    const originalConfirm = window.confirm;
    const originalAlert = window.alert;

    render(
      <MemoryRouter>
        <CartItemsProvider initialItems={cartItems}>
          <ShoppingCart />
        </CartItemsProvider>
      </MemoryRouter>
    );

    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();

    await user.click(
      screen.getByRole('button', {
        name: /to checkout/i,
      })
    );

    expect(window.confirm).toHaveBeenCalledWith(
      'Would you like to pay a total of $10.93?'
    );
    expect(window.alert).toHaveBeenCalledWith('Thank you for your purchase!');

    expect(
      screen.getByRole('heading', { name: /your shopping cart is empty/i })
    ).toBeInTheDocument();

    window.confirm = originalConfirm;
    window.alert = originalAlert;
  });
});
