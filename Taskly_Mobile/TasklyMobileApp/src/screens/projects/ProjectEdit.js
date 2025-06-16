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
import ApiClient from '../../api/apiClient';

const ProjectEdit = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.get(`/projects/${projectId}`);
      setProjectData({
        name: response.name,
        description: response.description,
        startDate: response.startDate.split('T')[0],
        endDate: response.endDate.split('T')[0],
        status: response.status,
      });
    } catch (error) {
      console.error('Project fetch error:', error);
      Alert.alert('Hata', 'Proje detayları yüklenirken bir hata oluştu.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setProjectData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (!projectData.name || !projectData.description || !projectData.startDate || !projectData.endDate) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
        return;
      }

      setIsLoading(true);
      await ApiClient.put(`/projects/${projectId}`, projectData);
      navigation.goBack();
    } catch (error) {
      console.error('Project update error:', error);
      Alert.alert('Hata', 'Proje güncellenirken bir hata oluştu.');
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
        <Text style={styles.title}>Projeyi Düzenle</Text>

        <TextInput
          style={styles.input}
          placeholder="Proje Adı"
          value={projectData.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Proje Açıklaması"
          value={projectData.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Başlangıç Tarihi (YYYY-MM-DD)"
          value={projectData.startDate}
          onChangeText={(text) => handleChange('startDate', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Bitiş Tarihi (YYYY-MM-DD)"
          value={projectData.endDate}
          onChangeText={(text) => handleChange('endDate', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Durum"
          value={projectData.status}
          onChangeText={(text) => handleChange('status', text)}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Güncelle</Text>
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

export default ProjectEdit; 