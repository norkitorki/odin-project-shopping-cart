import Navigation from '../components/Navigation/Navigation';
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
