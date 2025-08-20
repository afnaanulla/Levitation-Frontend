import api from './api';
import type { Product } from '../features/productSlice';

export const generateInvoice = async (products: Product[]) => {
  const response = await api.post('/invoices/generate', { products }, {
    responseType: 'blob',
  });
  return response.data;
};