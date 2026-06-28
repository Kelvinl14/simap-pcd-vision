import api from './api';

export interface Institution {
  id: string;
  name: string;
  cnpj: string;
  phone?: string;
  email?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state: string;
  responsible?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    pcds: number;
  };
}

export interface CreateInstitutionInput {
  name: string;
  cnpj: string;
  phone?: string;
  email?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state: string;
  responsible?: string;
}

export const institutionsService = {
  async findAll(): Promise<Institution[]> {
    const response = await api.get('/institutions');
    return response.data.data;
  },

  async findOne(id: string): Promise<Institution> {
    const response = await api.get(`/institutions/${id}`);
    return response.data.data;
  },

  async create(data: CreateInstitutionInput): Promise<Institution> {
    const response = await api.post('/institutions', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateInstitutionInput> & { active?: boolean }): Promise<Institution> {
    const response = await api.put(`/institutions/${id}`, data);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/institutions/${id}`);
  },
};
