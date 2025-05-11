export const API_URL = "192.168.1.168:5055/api";

export const config = {
    baseUrl: 'http://192.168.1.168:5055/api/',
    timeout: 10000, // 10 saniye
    retryCount: 3,  // Başarısız istekleri 3 kez tekrarla
};

// API istekleri için ortak header'ları hazırla
export const prepareHeaders = (headers, { getState }) => {
  const token = getState()?.auth?.token;
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  headers.set('Content-Type', 'application/json');
  return headers;
};