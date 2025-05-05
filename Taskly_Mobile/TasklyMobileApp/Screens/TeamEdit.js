import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetTeamByIdQuery, useUpdateTeamMutation } from '../Apis/TeamApi';
import { useNavigation } from '@react-navigation/native';

const TeamEdit = ({ route }) => {
  const { teamId } = route.params;
  const navigation = useNavigation();
  
  const { data: team, isLoading } = useGetTeamByIdQuery(teamId);
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (team) {
      setTeamData({
        name: team.name,
        description: team.description,
      });
    }
  }, [team]);

  const handleChange = (field, value) => {
    setTeamData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!teamData.name.trim()) {
      Alert.alert('Hata', 'Takım adı boş olamaz');
      return;
    }

    try {
      await updateTeam({
        id: teamId,
        ...teamData,
      }).unwrap();
      
      Alert.alert('Başarılı', 'Takım başarıyla güncellendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Takım güncellenirken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Takımı Düzenle</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Takım Adı</Text>
          <TextInput
            style={styles.input}
            value={teamData.name}
            onChangeText={value => handleChange('name', value)}
            placeholder="Takım adını girin"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={teamData.description}
            onChangeText={value => handleChange('description', value)}
            placeholder="Takım açıklamasını girin"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isUpdating && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Kaydet</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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

export default TeamEdit; 