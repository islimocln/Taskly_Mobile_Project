import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import Home from '../screens/home/Home';
import ProjectsScreen from '../screens/projects/ProjectsScreen';
import TeamsScreen from '../screens/teams/TeamsScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import DocumentsScreen from '../screens/documents/DocumentsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Ana Sayfa':
              return <Ionicons name="home" size={size} color={color} />;
            case 'Projeler':
              return <MaterialIcons name="folder-open" size={size} color={color} />;
            case 'Takımlar':
              return <Feather name="users" size={size} color={color} />;
            case 'Görevler':
              return <FontAwesome5 name="tasks" size={size} color={color} />;
            case 'Dökümanlar':
              return <Ionicons name="document-text-outline" size={size} color={color} />;
            case 'Ayarlar':
              return <Ionicons name="settings-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: '#1A73E8',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={Home} />
      <Tab.Screen name="Projeler" component={ProjectsScreen} />
      <Tab.Screen name="Takımlar" component={TeamsScreen} />
      <Tab.Screen name="Görevler" component={TasksScreen} />
      <Tab.Screen name="Dökümanlar" component={DocumentsScreen} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator; 