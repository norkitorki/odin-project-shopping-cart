export default function useLocalItems(key) {
  const localItems = () => JSON.parse(localStorage.getItem(key)) || [];
  const setLocalItems = (val) => localStorage.setItem(key, JSON.stringify(val));
  const removeLocalItems = () => localStorage.removeItem(key);

  return { localItems, setLocalItems, removeLocalItems };
}
