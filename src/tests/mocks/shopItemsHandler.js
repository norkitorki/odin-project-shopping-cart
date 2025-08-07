import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const shopItems = [
  {
    id: 1,
    title: 'Apple',
    price: 0.49,
    image: null,
    category: 'fruit',
  },
  {
    id: 2,
    title: 'Banana',
    price: 0.69,
    image: null,
    category: 'fruit',
  },
  {
    id: 3,
    title: 'Jeans',
    price: 44.95,
    image: null,
    category: 'clothes',
  },
  {
    id: 4,
    title: 'T-Shirt',
    price: 19.99,
    image: null,
    category: 'clothes',
  },
];

const shopItemsHandlers = [
  http.get('https://fakestoreapi.com/products', () =>
    HttpResponse.json(shopItems)
  ),
];

const server = setupServer(...shopItemsHandlers);

export { shopItems, server };
