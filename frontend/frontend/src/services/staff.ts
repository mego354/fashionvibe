import api from './api';
import { Staff } from '../types';

export const fetchStaff = async (): Promise<Staff[]> => {
  const { data } = await api.get('/staff/');
  return data;
};

export const fetchStaffMember = async (id: number): Promise<Staff> => {
  const { data } = await api.get(`/staff/${id}/`);
  return data;
};

export const createStaff = async (staff: Partial<Staff>): Promise<Staff> => {
  const { data } = await api.post('/staff/', staff);
  return data;
};

export const updateStaff = async (id: number, staff: Partial<Staff>): Promise<Staff> => {
  const { data } = await api.put(`/staff/${id}/`, staff);
  return data;
};

export const deleteStaff = async (id: number): Promise<void> => {
  await api.delete(`/staff/${id}/`);
}; 