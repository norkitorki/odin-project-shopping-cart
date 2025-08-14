import { create } from 'zustand';

const LOCAL_KEY = 'cart_items';

const localItems = () => JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
const setLocalItems = (val) =>
  localStorage.setItem(LOCAL_KEY, JSON.stringify(val));
const removeLocalItems = () => localStorage.removeItem(LOCAL_KEY);

const addCallback = (callbacks, name, callback) => {
  if (callbacks.find((cb) => cb.name === name)) return callbacks;

  return callbacks.concat([{ name, callback }]);
};

const removeCallback = (callbacks, name) =>
  callbacks.filter((cb) => cb.name !== name);

const total = (items) => items.reduce((t, c) => (t += c.quantity * c.price), 0);

const addToCart = (state, newItem, quantity = 1) => {
  if (!newItem || !quantity || quantity < 1) return;

  const items = state.cartItems;
  const itemIndex = items.findIndex((ite) => ite.id === newItem.id);
  itemIndex >= 0
    ? (items[itemIndex].quantity += Number(quantity))
    : items.push({ ...newItem, quantity: Number(quantity) });

  setLocalItems(items);
  state.onUpdate('add', newItem);
  return items;
};

const removeFromCart = (state, itemId) => {
  const newItems = state.cartItems.filter((item) => item.id !== itemId);

  newItems.length === 0 ? removeLocalItems() : setLocalItems(newItems);
  state.onUpdate('remove', itemId);
  return newItems;
};

const updateQuantity = (state, itemId, newQuantity) => {
  if (newQuantity <= 0) return removeFromCart(state, itemId);

  const items = state.cartItems.map((item) =>
    item.id === itemId ? { ...item, quantity: Number(newQuantity) } : item
  );

  setLocalItems(items);
  return items;
};

const clearItems = (state) => {
  removeLocalItems();
  state.onUpdate('clear', []);
  return [];
};

const onUpdate = (callbacks = [], action, item) =>
  callbacks.forEach((cb) => cb.callback.call(null, action, item));

export const useCartItems = create((set, get) => ({
  cartItems: localItems(),
  callbacks: [],

  addCallback: (name, callback) =>
    set((state) => ({
      callbacks: addCallback(state.callbacks, name, callback),
    })),

  removeCallback: (name) =>
    set((state) => ({ callbacks: removeCallback(state.callbacks, name) })),

  total: () => total(get().cartItems),

  onUpdate: (action, item) => onUpdate(get().callbacks, action, item),

  addToCart: (item, quantity) =>
    set((state) => ({ cartItems: addToCart(state, item, quantity) })),

  removeFromCart: (itemId) =>
    set((state) => ({ cartItems: removeFromCart(state, itemId) })),

  updateQuantity: (itemId, newQuantity) =>
    set((state) => ({
      cartItems: updateQuantity(state, itemId, newQuantity),
    })),

  clearItems: () => set((state) => ({ cartItems: clearItems(state) })),
}));
