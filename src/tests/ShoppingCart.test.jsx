import ShoppingCart from '../components/ShoppingCart/ShoppingCart';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import { test, expect, vi, describe, beforeEach, afterAll } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ClearCartItems, PopulateCartItems } from './helpers/cartItemsHelper';

test('renders heading when shopping cart is empty', () => {
  render(<ShoppingCart />);

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

  const renderWithCartItems = (component) =>
    render(
      <MemoryRouter>
        <PopulateCartItems items={cartItems} />
        {component}
      </MemoryRouter>
    );

  beforeEach(() => render(<ClearCartItems />));
  afterAll(() => render(<ClearCartItems />));

  test('renders heading', () => {
    renderWithCartItems(<ShoppingCart />);

    expect(
      screen.getByRole('heading', {
        name: /your shopping cart \(2\)/i,
      })
    ).toBeInTheDocument();
  });

  test('renders cart items', async () => {
    expect.assertions(8);
    renderWithCartItems(<ShoppingCart />);

    const firstItem = await screen.findByRole('row', {
      name: /test item 2 \$2\.99/i,
    });
    const secondItem = await screen.findByRole('row', {
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
    expect.assertions(2);
    const user = userEvent.setup();

    renderWithCartItems(<ShoppingCart />);

    const itemRow = await screen.findByRole('row', {
      name: /test item 2 \$2\.99/i,
    });
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

    renderWithCartItems(<ShoppingCart />);

    const itemRow = await screen.findByRole('row', {
      name: /test item 2 \$2\.99/i,
    });

    expect(itemRow).toBeInTheDocument();
    await user.click(
      within(itemRow).getByRole('button', {
        name: `Remove 'Test Item' from cart`,
      })
    );
    expect(itemRow).not.toBeInTheDocument();
  });

  test('removes item from cart when quantity hits 0', async () => {
    expect.assertions(1);
    const user = userEvent.setup();

    renderWithCartItems(<ShoppingCart />);

    const itemRow = await screen.findByRole('row', {
      name: /another item 1 \$4\.95/i,
    });
    const decreaseButton = within(itemRow).getByRole('button', {
      name: /decrease quantity/i,
    });

    await user.click(decreaseButton);

    expect(itemRow).not.toBeInTheDocument();
  });

  test('clears cart items', async () => {
    expect.assertions(3);
    const user = userEvent.setup();

    renderWithCartItems(<ShoppingCart />);

    const firstItem = await screen.findByRole('row', {
      name: /test item 2 \$2\.99/i,
    });
    const secondItem = await screen.findByRole('row', {
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
    expect.assertions(3);
    const user = userEvent.setup();
    const originalConfirm = window.confirm;
    const originalAlert = window.alert;

    renderWithCartItems(<ShoppingCart />);

    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();

    await user.click(
      await screen.findByRole('button', {
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
