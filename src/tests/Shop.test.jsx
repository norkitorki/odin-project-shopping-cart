import Shop from '../components/Shop/Shop';
import contextRender from './helpers/contextRender';
import { screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { MemoryRouter } from 'react-router';

test('renders shop items', () => {
  contextRender(
    <MemoryRouter initialEntries={['/shop']}>
      <Shop />
    </MemoryRouter>
  );

  const list = screen.getByRole('list');

  expect(list.children.length).toBeGreaterThan(0);
});
