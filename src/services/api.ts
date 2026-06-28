import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('simap_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros globais (ex: token expirado 401)
api.interceptors.response.use(
  (response) => {
    // Retornamos direto os dados úteis encapsulados pela API
    // O backend NestJS sempre encapsula em { success, message, data }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpar tokens e sessões do usuário
      localStorage.removeItem('simap_token');
      localStorage.removeItem('simap_user');
      localStorage.removeItem('simap_welcome_seen');
      
      // Se não estiver na tela de login, redireciona
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    
    // Tratamento de mensagens amigáveis de erro
    const apiError = error.response?.data?.message || 'Erro ao conectar com o servidor.';
    return Promise.reject(new Error(apiError));
  }
);

export default api;
