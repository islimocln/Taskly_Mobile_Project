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
import { useCreateProjectMutation } from '../Apis/ProjectApi';
import { useNavigation } from '@react-navigation/native';

const CreateProject = () => {
  const navigation = useNavigation();
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'Planning',
    priority: 'Medium',
  });

  const handleChange = (key, value) => {
    setProjectData({ ...projectData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!projectData.name || !projectData.description || !projectData.deadline) {
        Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      await createProject(projectData).unwrap();
      Alert.alert('Başarılı', 'Proje başarıyla oluşturuldu.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Proje oluşturulurken bir hata oluştu.');
      console.error('Create Project Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Proje Adı *</Text>
          <TextInput
            style={styles.input}
            value={projectData.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Proje adını girin"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={projectData.description}
            onChangeText={(text) => handleChange('description', text)}
            placeholder="Proje açıklamasını girin"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bitiş Tarihi *</Text>
          <TextInput
            style={styles.input}
            value={projectData.deadline}
            onChangeText={(text) => handleChange('deadline', text)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Öncelik</Text>
          <View style={styles.priorityButtons}>
            {['Low', 'Medium', 'High'].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  projectData.priority === priority && styles.priorityButtonActive,
                ]}
                onPress={() => handleChange('priority', priority)}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    projectData.priority === priority && styles.priorityButtonTextActive,
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
              <Text style={styles.submitButtonText}>Proje Oluştur</Text>
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
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  priorityButtonActive: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  priorityButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  priorityButtonTextActive: {
    color: '#FFF',
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

export default CreateProject; 