import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Screens
import Dashboard from '../screens/settings/Dashboard';
import Projects from '../screens/projects/Projects';
import Teams from '../screens/teams/Teams';
import Tasks from '../screens/tasks/Tasks';
import Documents from '../screens/documents/Documents';
import Profile from '../screens/settings/Profile';
import Settings from '../screens/settings/Settings';

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  const { user } = useSelector(state => state.auth);

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
        name="Projects"
        component={Projects}
        options={{
          title: 'Projeler',
          drawerIcon: ({ color }) => (
            <Ionicons name="folder-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Teams"
        component={Teams}
        options={{
          title: 'Takımlar',
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Tasks"
        component={Tasks}
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

export default MainNavigator; 