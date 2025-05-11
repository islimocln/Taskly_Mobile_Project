import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCreateTeamMutation } from '../Apis/TeamApi';
import { useNavigation } from '@react-navigation/native';

const CreateTeam = () => {
  const navigation = useNavigation();
  const [createTeam, { isLoading }] = useCreateTeamMutation();

  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (key, value) => {
    setTeamData({ ...teamData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!teamData.name) {
        Alert.alert('Hata', 'Lütfen takım adını girin.');
        return;
      }

      await createTeam({
        name: teamData.name,
        description: teamData.description
      }).unwrap();

      Alert.alert('Başarılı', 'Takım başarıyla oluşturuldu.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Takım oluşturulurken bir hata oluştu.');
      console.error('Create Team Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Takım Adı *</Text>
          <TextInput
            style={styles.input}
            value={teamData.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Takım adını girin"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={teamData.description}
            onChangeText={(text) => handleChange('description', text)}
            placeholder="Takım açıklamasını girin"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.submitButtonText}>Oluşturuluyor...</Text>
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={24} color="#FFF" />
              <Text style={styles.submitButtonText}>Takım Oluştur</Text>
            </>
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
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
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

export default CreateTeam; 