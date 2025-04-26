import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSignUpMutation } from '../Apis/AuthApi';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const [signUpData, setSignUpData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const navigation = useNavigation();
  const [signUp, { isLoading, error }] = useSignUpMutation();

  const handleChange = (key, value) => {
    setSignUpData({ ...signUpData, [key]: value });
  };

  const handleSignUp = async () => {
    try {
      const response = await signUp(signUpData).unwrap();
      if (response?.username) {
        Alert.alert('Başarılı', 'Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz.');
        navigation.navigate('Login');
      }
    } catch (err) {
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu.');
      console.error('Sign Up Error: ', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={signUpData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={signUpData.surname}
        onChangeText={(text) => handleChange('surname', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={signUpData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={signUpData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>Error: {error.message}</Text>}
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

export default SignUp;
