import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLoginMutation } from '../Apis/AuthApi';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../Storage/redux/AuthSlice';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [loginMutation, { isLoading }] = useLoginMutation();

  const handleChange = (key, value) => {
    setLoginData({ ...loginData, [key]: value });
  };

  const handleLogin = async () => {
    try {
      if (!loginData.emailOrUsername || !loginData.password) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
        return;
      }

      const response = await loginMutation(loginData).unwrap();
      
      if (response.token) {
        dispatch(login({ token: response.token, user: response.user }));
        // Login başarılı olduğunda navigation otomatik olarak Main stack'e geçecek
      } else {
        Alert.alert('Hata', 'Giriş başarısız. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      Alert.alert(
        'Giriş Hatası',
        err.message || 'Email/kullanıcı adı veya şifre hatalı olabilir.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="Email veya Kullanıcı Adı"
        value={loginData.emailOrUsername}
        onChangeText={(text) => handleChange('emailOrUsername', text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={loginData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
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
  }
});

export default Login;
