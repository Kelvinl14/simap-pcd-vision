import api from './api';

export interface DashboardSummary {
  totalPcds: number;
  totalInstitutions: number;
  totalUsers: number;
  newThisMonth: number;
}

export interface DisabilityDistribution {
  type: string;
  count: number;
}

export interface CityDistribution {
  city: string;
  count: number;
}

export interface InstitutionDistribution {
  id: string;
  name: string;
  count: number;
}

export interface RecentPcd {
  id: string;
  name: string;
  cpf: string;
  createdAt: string;
  disabilities: Array<{
    type: string;
    degree?: string;
    cid?: string;
  }>;
  institution?: {
    name: string;
  };
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get('/dashboard/summary');
    return response.data.data;
  },

  async getByDisability(): Promise<DisabilityDistribution[]> {
    const response = await api.get('/dashboard/by-disability');
    return response.data.data;
  },

  async getByCity(): Promise<CityDistribution[]> {
    const response = await api.get('/dashboard/by-city');
    return response.data.data;
  },

  async getByInstitution(): Promise<InstitutionDistribution[]> {
    const response = await api.get('/dashboard/by-institution');
    return response.data.data;
  },

  async getRecent(): Promise<RecentPcd[]> {
    const response = await api.get('/dashboard/recent');
    return response.data.data;
  },
};
