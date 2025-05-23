import api from './api';
import { Analytics } from '../types';

export const fetchAnalytics = async (storeId: number): Promise<Analytics> => {
  const { data } = await api.get(`/analytics/store/${storeId}/`);
  return data;
}; 