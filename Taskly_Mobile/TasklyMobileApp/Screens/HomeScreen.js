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
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.btnTextPrimary}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnTextSecondary}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.description}>Start managing your tasks today!</Text>
        <Text style={styles.subDescription}>Taskly 101: Get organized, plan your day, and track your goals!</Text>
      </View>
    </SafeAreaView>
  );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6EC',
  },
  imageContainer: {
    height: windowHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  buttonContainer: {
    height: windowHeight * 0.4,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#FCF6EC',
    borderColor: '#1A73E8',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 15,
    width: '80%',
  },
  btnTextPrimary: {
    color: '#1A73E8',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: '#1A73E8',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 20,
    width: '80%',
  },
  btnTextSecondary: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1A73E8',
    marginBottom: 5,
  },
  subDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});