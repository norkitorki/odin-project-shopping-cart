import Navigation from '../components/Navigation/Navigation';
import contextRender from './helpers/contextRender';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';

test('renders main navigation', () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  const navigation = screen.getByRole('navigation');

  expect(navigation).toBeInTheDocument();
  expect(navigation).toContainElement(
    screen.getByRole('link', { name: /home/i })
  );
  expect(navigation).toContainElement(
    screen.getByRole('link', { name: /shop/i })
  );
});

test('renders cart when not at "/" or in "/cart"', () => {
  contextRender(
    <MemoryRouter initialEntries={['/shop']}>
      <Navigation />
    </MemoryRouter>
  );

  expect(screen.getByTitle(/your cart is empty/i)).toBeInTheDocument();
});
