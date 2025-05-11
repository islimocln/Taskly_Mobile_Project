import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { View, Text, Button } from 'react-native';

// Import screens
import HomeScreen from '../Screens/HomeScreen';
import SignUp from '../Screens/SignUp';
import Login from '../Screens/Login';
import Dashboard from '../Screens/Dashboard';
import Projects from '../Screens/Projects';
import CreateProject from '../Screens/CreateProject';
import ProjectDetail from '../Screens/ProjectDetail';
import ProjectEdit from '../Screens/ProjectEdit';
import Teams from '../Screens/Teams';
import TeamDetail from '../Screens/TeamDetail';
import CreateTeam from '../Screens/CreateTeam';
import TeamEdit from '../Screens/TeamEdit';
import AddTeamMember from '../Screens/AddTeamMember';
import Tasks from '../Screens/Tasks';
import TaskDetail from '../Screens/TaskDetail';
import CreateTask from '../Screens/CreateTask';
import TaskEdit from '../Screens/TaskEdit';
import Documents from '../Screens/Documents';
import DocumentDetail from '../Screens/DocumentDetail';
import CreateDocument from '../Screens/CreateDocument';
import DocumentEdit from '../Screens/DocumentEdit';
import Profile from '../Screens/Profile';
import Settings from '../Screens/Settings';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A73E8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={({ navigation }) => ({ 
          title: 'Ana Sayfa',
          headerLeft: () => (
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 16 }}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="Projects" 
        component={Projects} 
        options={({ navigation }) => ({ 
          title: 'Projeler',
          headerLeft: () => (
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Ionicons 
              name="add-outline" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate('CreateProject')}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="Teams" 
        component={Teams} 
        options={({ navigation }) => ({ 
          title: 'Takımlar',
          headerRight: () => (
            <Ionicons 
              name="add-outline" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate('CreateTeam')}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="Tasks" 
        component={Tasks} 
        options={({ navigation }) => ({ 
          title: 'Görevler',
          headerLeft: () => (
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Ionicons 
              name="add-outline" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate('CreateTask')}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="Documents" 
        component={Documents} 
        options={({ navigation }) => ({ 
          title: 'Dökümanlar',
          headerLeft: () => (
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Ionicons 
              name="add-outline" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 16 }}
              onPress={() => navigation.navigate('CreateDocument')}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="Profile" 
        component={Profile} 
        options={({ navigation }) => ({ 
          title: 'Profil',
          headerLeft: () => (
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="Settings" 
        component={Settings} 
        options={({ navigation }) => ({ 
          title: 'Ayarlar',
          headerLeft: () => (
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })} 
      />
      <Stack.Screen name="CreateProject" component={CreateProject} options={{ title: 'Yeni Proje' }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetail} options={{ title: 'Proje Detayı' }} />
      <Stack.Screen name="ProjectEdit" component={ProjectEdit} options={{ title: 'Projeyi Düzenle' }} />
      <Stack.Screen name="CreateTeam" component={CreateTeam} options={{ title: 'Yeni Takım' }} />
      <Stack.Screen name="TeamDetail" component={TeamDetail} options={{ title: 'Takım Detayı' }} />
      <Stack.Screen name="TeamEdit" component={TeamEdit} options={{ title: 'Takımı Düzenle' }} />
      <Stack.Screen name="AddTeamMember" component={AddTeamMember} options={{ title: 'Üye Ekle' }} />
      <Stack.Screen name="CreateTask" component={CreateTask} options={{ title: 'Yeni Görev' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetail} options={{ title: 'Görev Detayı' }} />
      <Stack.Screen name="TaskEdit" component={TaskEdit} options={{ title: 'Görevi Düzenle' }} />
      <Stack.Screen name="CreateDocument" component={CreateDocument} options={{ title: 'Yeni Döküman' }} />
      <Stack.Screen name="DocumentDetail" component={DocumentDetail} options={{ title: 'Döküman Detayı' }} />
      <Stack.Screen name="DocumentEdit" component={DocumentEdit} options={{ title: 'Dökümanı Düzenle' }} />
    </Stack.Navigator>
  );
};

const TeamsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Teams" component={Teams} options={{ title: 'Takımlar' }} />
    <Stack.Screen name="CreateTeam" component={CreateTeam} options={{ title: 'Yeni Takım' }} />
    {/* ... */}
  </Stack.Navigator>
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1A73E8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        drawerActiveTintColor: '#1A73E8',
        drawerInactiveTintColor: '#666',
      }}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Ana Sayfa',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProjectsStack"
        component={ProjectsStack}
        options={{
          title: 'Projeler',
          drawerIcon: ({ color }) => (
            <Ionicons name="folder-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TeamsStack"
        component={TeamsStack}
        options={{
          title: 'Takımlar',
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TasksStack"
        component={TasksStack}
        options={{
          title: 'Görevler',
          drawerIcon: ({ color }) => (
            <Ionicons name="checkbox-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Documents"
        component={Documents}
        options={{
          title: 'Dökümanlar',
          drawerIcon: ({ color }) => (
            <Ionicons name="document-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profil',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Ayarlar',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

const ProjectsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Projects" component={Projects} options={{ title: 'Projeler' }} />
    <Stack.Screen name="CreateProject" component={CreateProject} options={{ title: 'Yeni Proje' }} />
    {/* Diğer proje ile ilgili ekranlar */}
  </Stack.Navigator>
);

const TasksStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tasks" component={Tasks} options={{ title: 'Görevler' }} />
    <Stack.Screen name="CreateTask" component={CreateTask} options={{ title: 'Yeni Görev' }} />
    {/* Diğer görev ile ilgili ekranlar */}
  </Stack.Navigator>
);

const AppNavigator = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={DrawerNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 