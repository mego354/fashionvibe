import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../services/orders';
import { Order } from '../types';

export const useOrders = () => {
  return useQuery<Order[], Error>(['orders'], fetchOrders);
}; 