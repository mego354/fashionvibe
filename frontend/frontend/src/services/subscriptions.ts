import api from './api';
import { Subscription } from '../types';

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const { data } = await api.get('/subscriptions/');
  return data;
};

export const fetchSubscription = async (id: number): Promise<Subscription> => {
  const { data } = await api.get(`/subscriptions/${id}/`);
  return data;
};

export const createSubscription = async (subscription: Partial<Subscription>): Promise<Subscription> => {
  const { data } = await api.post('/subscriptions/', subscription);
  return data;
};

export const updateSubscription = async (id: number, subscription: Partial<Subscription>): Promise<Subscription> => {
  const { data } = await api.put(`/subscriptions/${id}/`, subscription);
  return data;
};

export const deleteSubscription = async (id: number): Promise<void> => {
  await api.delete(`/subscriptions/${id}/`);
}; 