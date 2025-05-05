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
import { useCreateTaskMutation } from '../Apis/TaskApi';
import { useNavigation } from '@react-navigation/native';

const CreateTask = () => {
  const navigation = useNavigation();
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'Pending',
  });

  const handleChange = (key, value) => {
    setTaskData({ ...taskData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!taskData.title || !taskData.description || !taskData.dueDate) {
        Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      await createTask(taskData).unwrap();
      Alert.alert('Başarılı', 'Görev başarıyla oluşturuldu.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Görev oluşturulurken bir hata oluştu.');
      console.error('Create Task Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Görev Başlığı *</Text>
          <TextInput
            style={styles.input}
            value={taskData.title}
            onChangeText={(text) => handleChange('title', text)}
            placeholder="Görev başlığını girin"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={taskData.description}
            onChangeText={(text) => handleChange('description', text)}
            placeholder="Görev açıklamasını girin"
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
            value={taskData.dueDate}
            onChangeText={(text) => handleChange('dueDate', text)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Atanan Kişi</Text>
          <TextInput
            style={styles.input}
            value={taskData.assignedTo}
            onChangeText={(text) => handleChange('assignedTo', text)}
            placeholder="Görevi atayacağınız kişiyi seçin"
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
                  taskData.priority === priority && styles.priorityButtonActive,
                ]}
                onPress={() => handleChange('priority', priority)}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    taskData.priority === priority && styles.priorityButtonTextActive,
                  ]}
                >
                  {priority === 'Low' ? 'Düşük' :
                   priority === 'Medium' ? 'Orta' :
                   'Yüksek'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Oluşturuluyor...' : 'Görevi Oluştur'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    height: 120,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#1A73E8',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#666',
  },
  priorityButtonTextActive: {
    color: '#FFF',
  },
  submitButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateTask; 