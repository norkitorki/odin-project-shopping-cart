import Home from '../components/Home/Home';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';

test('renders heading', () => {
  render(<Home />);

  expect(
    screen.getByRole('heading', {
      name: /welcome to my super awesome shop!/i,
    })
  ).toBeInTheDocument();
});
