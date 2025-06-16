import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import ApiClient from '../../api/apiClient';

const SignUp = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const handleChange = (key, value) => {
    setSignUpData(prev => ({ ...prev, [key]: value }));
  };

  const handleSignUp = async () => {
    try {
      if (!signUpData.name || !signUpData.surname || !signUpData.email || !signUpData.password) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
        return;
      }
      setIsLoading(true);
      const response = await ApiClient.post('/Auth/signup', {
        name: signUpData.name,
        surname: signUpData.surname,
        email: signUpData.email,
        password: signUpData.password,
      });
      if (response.token) {
        dispatch(login({ token: response.token, user: response.user }));
      } else {
        Alert.alert('Hata', 'Kayıt başarısız. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('SignUp Error:', err);
      Alert.alert(
        'Kayıt Hatası',
        err.message || 'Kayıt işlemi sırasında bir hata oluştu.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={signUpData.name}
        onChangeText={(text) => handleChange('name', text)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={signUpData.surname}
        onChangeText={(text) => handleChange('surname', text)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={signUpData.email}
        onChangeText={(text) => handleChange('email', text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={signUpData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignUp} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>
          Zaten hesabınız var mı? <Text style={styles.loginTextBold}>Giriş Yapın</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FCF6EC',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A73E8',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1A73E8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#1A73E8',
    fontWeight: 'bold',
  }
});

export default SignUp;
