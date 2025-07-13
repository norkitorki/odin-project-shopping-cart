import Home from '../components/Home/Home';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';

test('renders heading', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('heading', {
      name: /welcome to my super awesome shop!/i,
    })
  ).toBeInTheDocument();
});

test('renders shop link', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(
    screen.getByRole('link', {
      name: /go to shop/i,
    })
  ).toBeInTheDocument();
});
