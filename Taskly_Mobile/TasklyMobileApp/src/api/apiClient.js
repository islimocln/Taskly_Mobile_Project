import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://172.25.224.1:5055/api'; // Bu URL'i production'da değiştirin

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token'ı ekle
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata durumlarını yönet
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Burada kullanıcıyı login sayfasına yönlendirebilirsiniz
    }
    console.log(error.response?.data || error.message);
    Alert.alert("Kayıt Hatası", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default apiClient; 