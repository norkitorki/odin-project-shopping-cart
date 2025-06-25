import ErrorPage from '../components/ErrorPage/ErrorPage';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { test, expect } from 'vitest';

const RoutesStub = createRoutesStub([{ path: '/', ErrorBoundary: ErrorPage }]);

test('renders error boundary', () => {
  render(<RoutesStub initialEntries={['/nopath']} />);

  expect(
    screen.getByRole('heading', { name: /404: not found/i })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/error: no route matches url "\/nopath"/i)
  ).toBeInTheDocument();
});
