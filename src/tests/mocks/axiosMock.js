import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const mockAdapter = new AxiosMockAdapter(axios);

const axiosMock = (url, responseData) => {
  mockAdapter.onGet(url).reply(200, responseData);
};

export default axiosMock;
