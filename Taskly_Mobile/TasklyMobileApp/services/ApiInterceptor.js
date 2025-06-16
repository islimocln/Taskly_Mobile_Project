import { store } from '../Storage/store';
import { logout } from '../Storage/redux/AuthSlice';
import JwtService from './JwtService';

class ApiInterceptor {
  static async handleRequest(config) {
    try {
      const token = await JwtService.getToken();
      
      if (token) {
        // Token'ın geçerliliğini kontrol et
        if (JwtService.isTokenValid(token)) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
          };
        } else {
          // Token geçersizse logout yap
          store.dispatch(logout());
          throw new Error('Token geçersiz');
        }
      }
      
      return config;
    } catch (error) {
      console.error('API İstek Hatası:', error);
      throw error;
    }
  }

  static async handleResponse(response) {
    try {
      // 401 hatası kontrolü
      if (response.status === 401) {
        store.dispatch(logout());
        throw new Error('Oturum süresi doldu');
      }
      
      return response;
    } catch (error) {
      console.error('API Yanıt Hatası:', error);
      throw error;
    }
  }

  static async handleError(error) {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    throw error;
  }
}

export default ApiInterceptor; 