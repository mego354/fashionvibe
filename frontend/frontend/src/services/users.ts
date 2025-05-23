import api from './api';
import { User } from '../types';

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users/');
  return data;
};

export const fetchUser = async (id: number): Promise<User> => {
  const { data } = await api.get(`/users/${id}/`);
  return data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const { data } = await api.post('/users/', user);
  return data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const { data } = await api.put(`/users/${id}/`, user);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}/`);
}; 