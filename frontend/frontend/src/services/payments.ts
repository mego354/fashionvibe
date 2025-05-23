import api from './api';
import { Payment } from '../types';

export const fetchPayments = async (): Promise<Payment[]> => {
  const { data } = await api.get('/payments/');
  return data;
};

export const fetchPayment = async (id: number): Promise<Payment> => {
  const { data } = await api.get(`/payments/${id}/`);
  return data;
};

export const createPayment = async (payment: Partial<Payment>): Promise<Payment> => {
  const { data } = await api.post('/payments/', payment);
  return data;
}; 