import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  toggleDarkMode,
  togglePushNotifications,
  toggleEmailUpdates,
  restoreSettings,
} from '../Storage/redux/SettingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('settings');
        if (savedSettings) {
          dispatch(restoreSettings(JSON.parse(savedSettings)));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const settingSections = [
    {
      title: 'App Settings',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Push Notifications',
          type: 'switch',
          value: settings.pushNotifications,
          onValueChange: () => dispatch(togglePushNotifications()),
        },
        {
          icon: 'moon-outline',
          label: 'Dark Mode',
          type: 'switch',
          value: settings.darkMode,
          onValueChange: () => dispatch(toggleDarkMode()),
        },
        {
          icon: 'mail-outline',
          label: 'Email Updates',
          type: 'switch',
          value: settings.emailUpdates,
          onValueChange: () => dispatch(toggleEmailUpdates()),
        },
      ],
    },
    {
      title: 'App Info',
      items: [
        {
          icon: 'information-circle-outline',
          label: 'About Taskly',
          type: 'link',
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Privacy Policy',
          type: 'link',
        },
        {
          icon: 'document-text-outline',
          label: 'Terms of Service',
          type: 'link',
        },
      ],
    },
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity 
      key={item.label} 
      style={styles.settingItem}
      disabled={item.type === 'switch'}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={item.icon} size={24} color="#1A73E8" />
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: '#767577', true: '#1A73E8' }}
          thumbColor={item.value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#1A73E8" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
      {settingSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
            {section.title}
          </Text>
          <View style={[styles.sectionContent, settings.darkMode && styles.darkSectionContent]}>
            {section.items.map(renderSettingItem)}
          </View>
        </View>
      ))}

      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, settings.darkMode && styles.darkText]}>
          Taskly v1.0.0
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginLeft: 4,
  },
  darkText: {
    color: '#fff',
  },
  sectionContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkSectionContent: {
    backgroundColor: '#2a2a2a',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  versionText: {
    color: '#666',
    fontSize: 14,
  },
});

export default Settings; 