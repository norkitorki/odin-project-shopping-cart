import CartDropdown from '../components/CartDropdown/CartDropdown';
import userEvent from '@testing-library/user-event';
import { ClearCartItems, PopulateCartItems } from './helpers/cartItemsHelper';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect, describe, afterAll, beforeEach } from 'vitest';

const cartItems = [
  { id: 1, title: 'USB cable', price: 1.99, quantity: 1 },
  { id: 2, title: 'Screen Protector', price: 14.99, quantity: 2 },
];

beforeEach(() => render(<ClearCartItems />));
afterAll(() => render(<ClearCartItems />));

test('renders triggerbutton', () => {
  render(
    <MemoryRouter>
      <CartDropdown />
    </MemoryRouter>
  );

  expect(screen.getByTitle(/your cart is empty/i)).toBeInTheDocument();
});

test('renders title indicating current cart items count', () => {
  render(
    <MemoryRouter>
      <ClearCartItems />
      <PopulateCartItems items={cartItems} />
      <CartDropdown />
    </MemoryRouter>
  );

  expect(screen.getByTitle(/2 items in cart/i)).toBeInTheDocument();
});

test('does not render when excludedPaths includes current path', () => {
  render(
    <MemoryRouter initialIndex={0} initialEntries={['/about']}>
      <CartDropdown excludedPaths={['/about']} />
    </MemoryRouter>
  );

  expect(screen.queryByTitle(/your cart is empty/i)).toBeNull();
});

describe('when dropdown is retracted', () => {
  test('shows dropdown when trigger button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartDropdown />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('dropdown');

    expect(dropdown.classList.value.includes('menuExtended')).toBeFalsy();

    await user.click(screen.getByTitle(/your cart is empty/i));

    expect(dropdown).toBeVisible();
    expect(dropdown.classList.value.includes('menuExtended')).toBeTruthy();
  });
});

describe('when dropdown is extended', () => {
  test('renders shopping cart link', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartDropdown />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('dropdown');

    await user.click(screen.getByTitle(/your cart is empty/i));

    expect(
      within(dropdown).getByRole('link', {
        name: /go to cart/i,
      })
    ).toBeInTheDocument();
  });

  test('renders cart items and total', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <PopulateCartItems items={cartItems} />
        <CartDropdown />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('dropdown');

    await user.click(screen.getByTitle(/2 items in cart/i));

    expect(
      within(dropdown).getByRole('link', {
        name: /usb cable/i,
      })
    ).toBeInTheDocument();

    expect(
      within(dropdown).getByRole('link', {
        name: /screen protector/i,
      })
    ).toBeInTheDocument();

    expect(within(dropdown).getByText(/\$31\.97/i)).toBeInTheDocument();
  });

  test('retracts dropdown when trigger button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartDropdown />
      </MemoryRouter>
    );

    const dropdown = screen.getByTestId('dropdown');

    const dropdownButton = screen.getByTitle(/your cart is empty/i);

    await user.click(dropdownButton);
    await user.click(dropdownButton);

    expect(dropdown.classList.value.includes('menuExtended')).toBeFalsy();
  });
});
