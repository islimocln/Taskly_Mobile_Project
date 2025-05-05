import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAddTeamMemberMutation } from '../Apis/TeamApi';
import { useNavigation } from '@react-navigation/native';

const AddTeamMember = ({ route }) => {
  const { teamId } = route.params;
  const navigation = useNavigation();
  
  const [addTeamMember, { isLoading }] = useAddTeamMemberMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');

  // Bu örnek için statik kullanıcı listesi
  const users = [
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com' },
    { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com' },
    { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com' },
    { id: 4, name: 'Zeynep Şahin', email: 'zeynep@example.com' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedUser) {
      Alert.alert('Hata', 'Lütfen bir kullanıcı seçin');
      return;
    }

    if (!role.trim()) {
      Alert.alert('Hata', 'Lütfen bir rol seçin');
      return;
    }

    try {
      await addTeamMember({
        teamId,
        userId: selectedUser.id,
        role,
      }).unwrap();
      
      Alert.alert('Başarılı', 'Kullanıcı başarıyla takıma eklendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı eklenirken bir hata oluştu');
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        selectedUser?.id === item.id && styles.userItemSelected,
      ]}
      onPress={() => setSelectedUser(item)}
    >
      <View style={styles.userInfo}>
        <Ionicons name="person-circle-outline" size={40} color="#1A73E8" />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
      {selectedUser?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#1A73E8" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Takım Üyesi Ekle</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kullanıcı Ara</Text>
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="İsim veya e-posta ile ara"
          />
        </View>

        <View style={styles.userList}>
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rol</Text>
          <TextInput
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="Kullanıcının rolünü girin"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Ekle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userList: {
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userItemSelected: {
    borderColor: '#1A73E8',
    backgroundColor: '#F0F7FF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTeamMember; 