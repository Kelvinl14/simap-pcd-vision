import api from './api';
import { Institution } from './institutions.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMINISTRADOR' | 'GESTOR' | 'OPERADOR' | 'CONSULTA';
  institutionId?: string;
  institution?: Institution;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  role: 'ADMINISTRADOR' | 'GESTOR' | 'OPERADOR' | 'CONSULTA';
  institutionId?: string;
}

export const usersService = {
  async findAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data.data;
  },

  async findOne(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  async create(data: CreateUserInput): Promise<User> {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateUserInput> & { active?: boolean }): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
