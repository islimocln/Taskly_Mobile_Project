import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

class JwtService {
  static async getToken() {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Token alınamadı:', error);
      return null;
    }
  }

  static async setToken(token) {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.error('Token kaydedilemedi:', error);
    }
  }

  static async removeToken() {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Token silinemedi:', error);
    }
  }

  static isTokenValid(token) {
    try {
      if (!token) return false;
      
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Token'ın süresi dolmuş mu kontrol et
      if (decoded.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token doğrulanamadı:', error);
      return false;
    }
  }

  static getDecodedToken(token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Token decode edilemedi:', error);
      return null;
    }
  }
}

export default JwtService; 