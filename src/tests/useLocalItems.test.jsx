import useLocalItems from '../hooks/useLocalItems';
import { expect, test } from 'vitest';

const items = [
  { id: 1, title: 'Item #1' },
  { id: 2, title: 'Item #2' },
];

test('saves items to local storage', () => {
  const { setLocalItems } = useLocalItems('my_items');

  setLocalItems(items);

  expect(localStorage.getItem('my_items')).toBe(JSON.stringify(items));
});

test('returns items from local storage', () => {
  const { localItems, setLocalItems } = useLocalItems('my_items');

  setLocalItems(items);

  expect(localItems()).toMatchObject(items);
});

test('removes items from local storage', () => {
  const { localItems, setLocalItems, removeLocalItems } =
    useLocalItems('my_items');

  setLocalItems(items);

  expect(localStorage.getItem('my_items')).not.toBeNull();

  removeLocalItems('my_items');

  expect(localItems()).toStrictEqual([]);
  expect(localStorage.getItem('my_items')).toBeNull();
});
