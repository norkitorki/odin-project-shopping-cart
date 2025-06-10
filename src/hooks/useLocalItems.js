const KEY = 'cart_items';

const localItems = () => JSON.parse(localStorage.getItem(KEY)) || [];
const setLocalItems = (val) => localStorage.setItem(KEY, JSON.stringify(val));
const removeLocalItems = () => localStorage.removeItem(KEY);

export default function useLocalItems() {
  return { localItems, setLocalItems, removeLocalItems };
}
