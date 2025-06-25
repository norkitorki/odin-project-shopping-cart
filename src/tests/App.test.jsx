import App from '../components/App/App';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';

test('renders navigation', () => {
  render(<MemoryRouter children={<App />} />);

  const navigation = screen.getByRole('navigation');

  expect(navigation).toBeInTheDocument();
  expect(navigation).toContainElement(
    screen.getByRole('link', { name: /home/i })
  );
  expect(navigation).toContainElement(
    screen.getByRole('link', { name: /shop/i })
  );
});
