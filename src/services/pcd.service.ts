import api from './api';
import { Institution } from './institutions.service';

export type DisabilityType = 'FISICA' | 'VISUAL' | 'AUDITIVA' | 'INTELECTUAL' | 'MULTIPLA' | 'PSICOSSOCIAL';
export type DisabilityDegree = 'LEVE' | 'MODERADO' | 'SEVERO';
export type Sex = 'MASCULINO' | 'FEMININO' | 'OUTRO';

export interface Disability {
  id?: string;
  pcdId?: string;
  type: DisabilityType;
  degree?: DisabilityDegree;
  cid?: string;
  description?: string;
}

export interface Pcd {
  id: string;
  name: string;
  cpf: string;
  cns?: string;
  birthDate?: string;
  sex?: Sex;
  phone?: string;
  email?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state: string;
  institutionId?: string;
  institution?: Institution;
  observations?: string;
  createdAt: string;
  updatedAt: string;
  disabilities: Disability[];
}

export interface CreatePcdInput {
  name: string;
  cpf: string;
  cns?: string;
  birthDate?: string;
  sex?: Sex;
  phone?: string;
  email?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city: string;
  state: string;
  institutionId?: string;
  observations?: string;
  disabilities: Array<Omit<Disability, 'id' | 'pcdId'>>;
}

export interface PcdQueryFilters {
  search?: string;
  institutionId?: string;
  disabilityType?: DisabilityType;
  city?: string;
  page?: number;
  limit?: number;
}

export interface PcdListResponse {
  success: boolean;
  message: string;
  data: Pcd[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const pcdService = {
  async findAll(filters: PcdQueryFilters): Promise<PcdListResponse> {
    const response = await api.get('/pcd', { params: filters });
    return response.data;
  },

  async findOne(id: string): Promise<Pcd> {
    const response = await api.get(`/pcd/${id}`);
    return response.data.data;
  },

  async create(data: CreatePcdInput): Promise<Pcd> {
    const response = await api.post('/pcd', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreatePcdInput>): Promise<Pcd> {
    const response = await api.put(`/pcd/${id}`, data);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/pcd/${id}`);
  },
};
