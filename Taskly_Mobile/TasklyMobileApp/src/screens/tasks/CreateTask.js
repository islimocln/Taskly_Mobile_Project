import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ApiClient from '../../api/apiClient';

const CreateTask = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'TODO',
    assigneeId: '',
    projectId: '',
  });

  useEffect(() => {
    fetchProjectsAndUsers();
  }, []);

  const fetchProjectsAndUsers = async () => {
    try {
      setIsLoading(true);
      const [projectsResponse, usersResponse] = await Promise.all([
        ApiClient.get('/projects'),
        ApiClient.get('/users'),
      ]);
      setProjects(projectsResponse);
      setUsers(usersResponse);
    } catch (error) {
      console.error('Data fetch error:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setTaskData(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    try {
      if (!taskData.title || !taskData.description || !taskData.dueDate || !taskData.assigneeId || !taskData.projectId) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
        return;
      }

      setIsLoading(true);
      await ApiClient.post('/tasks', taskData);
      navigation.goBack();
    } catch (error) {
      console.error('Task creation error:', error);
      Alert.alert('Hata', 'Görev oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
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
      <View style={styles.form}>
        <Text style={styles.title}>Yeni Görev Oluştur</Text>

        <TextInput
          style={styles.input}
          placeholder="Görev Başlığı"
          value={taskData.title}
          onChangeText={(text) => handleChange('title', text)}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Görev Açıklaması"
          value={taskData.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Bitiş Tarihi (YYYY-MM-DD)"
          value={taskData.dueDate}
          onChangeText={(text) => handleChange('dueDate', text)}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taskData.status}
            onValueChange={(value) => handleChange('status', value)}
            style={styles.picker}
          >
            <Picker.Item label="Yapılacak" value="TODO" />
            <Picker.Item label="Devam Ediyor" value="IN_PROGRESS" />
            <Picker.Item label="Tamamlandı" value="DONE" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taskData.assigneeId}
            onValueChange={(value) => handleChange('assigneeId', value)}
            style={styles.picker}
          >
            <Picker.Item label="Atanan Kişi Seçin" value="" />
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.name} value={user.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taskData.projectId}
            onValueChange={(value) => handleChange('projectId', value)}
            style={styles.picker}
          >
            <Picker.Item label="Proje Seçin" value="" />
            {projects.map((project) => (
              <Picker.Item key={project.id} label={project.name} value={project.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Oluştur</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6EC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF6EC',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#1A73E8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateTask; 