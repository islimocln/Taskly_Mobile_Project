import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import store from './Storage/store';
import { restoreSession } from './Storage/redux/AuthSlice';

import HomeScreen from './Screens/HomeScreen';
import SignUp from './Screens/SignUp';
import Login from './Screens/Login';
import Dashboard from './Screens/Dashboard';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkStoredSession = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (token && user) {
        dispatch(restoreSession({ token, user: JSON.parse(user) }));
      }

      setCheckingSession(false);
    };

    checkStoredSession();
  }, []);

  if (checkingSession) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Dashboard' : 'Home'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
