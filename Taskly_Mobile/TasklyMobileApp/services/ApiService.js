import { config } from '../src/api/config';
import ApiInterceptor from './ApiInterceptor';

class ApiService {
  static async request(endpoint, options = {}) {
    try {
      // İstek konfigürasyonunu hazırla
      const configObj = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      // İstek öncesi interceptor
      const interceptedConfig = await ApiInterceptor.handleRequest(configObj);

      // API isteğini yap
      const response = await fetch(`${config.baseUrl}${endpoint}`, interceptedConfig);

      // Yanıt sonrası interceptor
      const interceptedResponse = await ApiInterceptor.handleResponse(response);

      // JSON yanıtını al
      const data = await interceptedResponse.json();

      return data;
    } catch (error) {
      return ApiInterceptor.handleError(error);
    }
  }

  // GET isteği
  static async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // POST isteği
  static async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT isteği
  static async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE isteği
  static async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default ApiService; 