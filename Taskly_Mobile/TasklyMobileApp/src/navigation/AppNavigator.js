import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth Screens
import Welcome from '../screens/auth/Welcome';
import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';

// Main Navigation
import TabNavigator from './TabNavigator';
import CreateProject from '../screens/projects/CreateProject';
import CreateTeam from '../screens/teams/CreateTeam';
import TasksScreen from '../screens/tasks/TasksScreen';
import CreateTaskScreen from '../screens/tasks/CreateTaskScreen';
import TaskEditScreen from '../screens/tasks/TaskEditScreen';
import projectDetail from '../screens/projects/projectDetail';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          },
          headerTitleStyle: {
            color: '#1A73E8',
            fontWeight: 'bold',
          },
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen 
          name="Welcome" 
          component={Welcome} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ headerShown: false }}
        />

        {/* Main Stack */}
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CreateProject" 
          component={CreateProject} 
          options={{ title: 'Yeni Proje Oluştur' }}
        />
        <Stack.Screen 
          name="CreateTeam" 
          component={CreateTeam} 
          options={{ title: 'Yeni Takım Oluştur' }}
        />
        <Stack.Screen
          name="Tasks"
          component={TasksScreen}
          options={{
            title: 'Görevler',
          }}
        />
        <Stack.Screen
          name="CreateTask"
          component={CreateTaskScreen}
          options={{
            title: 'Yeni Görev',
          }}
        />
        <Stack.Screen
          name="TaskEdit"
          component={TaskEditScreen}
          options={{
            title: 'Görevi Düzenle',
          }}
        />
        <Stack.Screen 
          name="projectDetail" 
          component={projectDetail} 
          options={{ title: 'Proje Detayı' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 