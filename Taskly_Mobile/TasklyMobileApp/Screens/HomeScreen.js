import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Üst %60: Görsel */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/TasklyHome.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Alt %40: Butonlar ve metin */}
      <View style={styles.buttonContainer}>
        <Text style={styles.title}>Taskly'e Hoş Geldiniz!</Text>
        <Text style={styles.description}>Projelerinizi ve görevlerinizi kolayca yönetin</Text>
        
        <TouchableOpacity 
          style={styles.btnPrimary} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.btnTextPrimary}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.btnTextSecondary}>Hesap Oluştur</Text>
        </TouchableOpacity>

        <Text style={styles.subDescription}>
          Hemen başlayın ve işlerinizi organize edin!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    height: windowHeight * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  buttonContainer: {
    height: windowHeight * 0.5,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A73E8',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    elevation: 2,
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1A73E8',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 24,
    width: '100%',
  },
  btnTextSecondary: {
    color: '#1A73E8',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  subDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});