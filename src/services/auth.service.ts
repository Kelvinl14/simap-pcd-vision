import api from './api';

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    institutionId?: string;
    active: boolean;
  };
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    // O interceptor retorna a response completa, extraímos data.data
    return response.data.data;
  },

  async getProfile(): Promise<LoginResponse['user']> {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};
