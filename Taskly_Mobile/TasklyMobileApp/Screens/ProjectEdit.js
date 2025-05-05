import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetProjectByIdQuery, useUpdateProjectMutation } from '../Apis/ProjectApi';

const ProjectEdit = ({ route }) => {
  const { projectId } = route.params;
  const navigation = useNavigation();
  
  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(projectId);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    startDate: '',
    deadline: '',
    status: '',
    priority: '',
  });

  useEffect(() => {
    if (project) {
      setProjectData({
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        deadline: project.deadline,
        status: project.status,
        priority: project.priority,
      });
    }
  }, [project]);

  const handleChange = (key, value) => {
    setProjectData({ ...projectData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!projectData.name || !projectData.description || !projectData.deadline) {
        Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      await updateProject({ id: projectId, project: projectData }).unwrap();
      Alert.alert('Başarılı', 'Proje başarıyla güncellendi.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Proje güncellenirken bir hata oluştu.');
      console.error('Update Project Error:', error);
    }
  };

  if (isProjectLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

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
          <Text style={styles.label}>Başlangıç Tarihi</Text>
          <TextInput
            style={styles.input}
            value={projectData.startDate}
            onChangeText={(text) => handleChange('startDate', text)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
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
          <Text style={styles.label}>Durum</Text>
          <View style={styles.statusButtons}>
            {['Planning', 'InProgress', 'Completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  projectData.status === status && styles.statusButtonActive,
                ]}
                onPress={() => handleChange('status', status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    projectData.status === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
          style={[styles.submitButton, isUpdating && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Text style={styles.submitButtonText}>Güncelleniyor...</Text>
          ) : (
            <>
              <Ionicons name="save-outline" size={24} color="#FFF" />
              <Text style={styles.submitButtonText}>Güncelle</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusButtonActive: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  statusButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#FFF',
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

export default ProjectEdit; 