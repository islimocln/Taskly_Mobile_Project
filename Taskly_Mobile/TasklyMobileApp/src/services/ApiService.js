import { API_CONFIG } from '../api/config';
import JwtService from './JwtService';

class ApiService {
  static async request(endpoint, options = {}) {
    try {
      const token = await JwtService.getToken();
      
      const requestConfig = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, requestConfig);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token geçersiz, logout yap
          await JwtService.removeToken();
          throw new Error('Oturum süresi doldu');
        }
        throw new Error('API isteği başarısız');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Hatası:', error);
      throw error;
    }
  }

  static get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  static delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default ApiService; 