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
import { useGetTaskByIdQuery, useUpdateTaskMutation } from '../Apis/TaskApi';

const TaskEdit = ({ route }) => {
  const { taskId } = route.params;
  const navigation = useNavigation();
  
  const { data: task, isLoading: isTaskLoading } = useGetTaskByIdQuery(taskId);
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: '',
    priority: '',
    assignedTo: '',
  });

  useEffect(() => {
    if (task) {
      setTaskData({
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
      });
    }
  }, [task]);

  const handleChange = (key, value) => {
    setTaskData({ ...taskData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!taskData.title || !taskData.description || !taskData.deadline) {
        Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      await updateTask({ id: taskId, task: taskData }).unwrap();
      Alert.alert('Başarılı', 'Görev başarıyla güncellendi.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Görev güncellenirken bir hata oluştu.');
      console.error('Update Task Error:', error);
    }
  };

  if (isTaskLoading) {
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
            value={taskData.deadline}
            onChangeText={(text) => handleChange('deadline', text)}
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
            placeholder="Atanan kişinin adını girin"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Durum</Text>
          <View style={styles.statusButtons}>
            {['Todo', 'InProgress', 'Completed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  taskData.status === status && styles.statusButtonActive,
                ]}
                onPress={() => handleChange('status', status)}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    taskData.status === status && styles.statusButtonTextActive,
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

export default TaskEdit; 