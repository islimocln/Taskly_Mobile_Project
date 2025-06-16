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
import { useDispatch } from 'react-redux';
import { updateTask } from '../store/slices/taskSlice';

const statusOptions = [
  { value: 1, label: 'Beklemede' },
  { value: 2, label: 'Aktif' },
  { value: 3, label: 'Tamamlandı' },
];

const priorityOptions = [
  { value: 1, label: 'Düşük' },
  { value: 2, label: 'Orta' },
  { value: 3, label: 'Yüksek' },
];

const TaskEdit = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 1,
    priority: 2,
    assigneeId: '',
    projectId: '',
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const data = await import('../../services/ApiService').then(m => m.default.get(`/Tasks/${taskId}`));
        setTaskData({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
          status: data.status,
          priority: data.priority,
          assigneeId: data.assignments && data.assignments.length > 0 ? data.assignments[0].userId : '',
          projectId: data.projectId,
        });
      } catch (error) {
        Alert.alert('Hata', 'Görev detayları yüklenirken bir hata oluştu.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    const fetchProjectsAndUsers = async () => {
      try {
        const ApiService = (await import('../../services/ApiService')).default;
        const [projectsResponse, usersResponse] = await Promise.all([
          ApiService.get('/projects'),
          ApiService.get('/User'),
        ]);
        setProjects(projectsResponse);
        setUsers(usersResponse);
      } catch (error) {
        Alert.alert('Hata', 'Projeler veya kullanıcılar yüklenemedi.');
      }
    };
    fetchTask();
    fetchProjectsAndUsers();
  }, [taskId]);

  const handleChange = (key, value) => {
    setTaskData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (!taskData.title || !taskData.description || !taskData.dueDate || !taskData.assigneeId || !taskData.projectId) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
        return;
      }
      setIsLoading(true);
      await dispatch(updateTask({
        ...taskData,
        id: taskId,
        assignedUserIds: taskData.assigneeId ? [taskData.assigneeId] : [],
      })).unwrap();
      Alert.alert('Başarılı', 'Görev güncellendi.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', error?.response?.data?.message || error.message || 'Görev güncellenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !taskData.title) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Görevi Düzenle</Text>
        <TextInput
          style={styles.input}
          placeholder="Görev Başlığı"
          value={taskData.title}
          onChangeText={text => handleChange('title', text)}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Görev Açıklaması"
          value={taskData.description}
          onChangeText={text => handleChange('description', text)}
          multiline
          numberOfLines={4}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taskData.status}
            onValueChange={value => handleChange('status', value)}
            style={styles.picker}
          >
            {statusOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taskData.priority}
            onValueChange={value => handleChange('priority', value)}
            style={styles.picker}
          >
            {priorityOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taskData.assigneeId}
            onValueChange={value => handleChange('assigneeId', value)}
            style={styles.picker}
          >
            <Picker.Item label="Atanan Kişi Seçin" value="" />
            {users.map(user => (
              <Picker.Item key={user.id} label={`${user.name} ${user.surname}`} value={user.id} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Bitiş Tarihi (YYYY-MM-DD)"
          value={taskData.dueDate}
          onChangeText={text => handleChange('dueDate', text)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={taskData.projectId}
            onValueChange={value => handleChange('projectId', value)}
            style={styles.picker}
          >
            <Picker.Item label="Proje Seçin" value="" />
            {projects.map(project => (
              <Picker.Item key={project.id} label={project.name} value={project.id} />
            ))}
          </Picker>
        </View>
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
  container: { flex: 1, backgroundColor: '#FCF6EC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FCF6EC' },
  form: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A73E8', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerContainer: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  picker: { height: 50 },
  button: { backgroundColor: '#1A73E8', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#93c5fd' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default TaskEdit; 