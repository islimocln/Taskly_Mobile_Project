import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLoginMutation } from '../Apis/AuthApi';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Storage/redux/AuthSlice';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [login, { isLoading, error }] = useLoginMutation();

  const handleChange = (key, value) => {
    setLoginData({ ...loginData, [key]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await login(loginData).unwrap();
      if (response.token) {
        dispatch(loginSuccess({ token: response.token, user: response.user }));
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      Alert.alert('Giriş Hatası', 'Email/kullanıcı adı veya şifre hatalı olabilir.');
      console.error('Login Error: ', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        value={loginData.emailOrUsername}
        onChangeText={(text) => handleChange('emailOrUsername', text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={loginData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Logging In...' : 'Log In'}</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>Hata: {error.message}</Text>}
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
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default Login;
