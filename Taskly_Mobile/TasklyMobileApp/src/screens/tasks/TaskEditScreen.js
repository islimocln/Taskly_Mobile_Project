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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../../api/apiClient';

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

const TaskEditScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1);
  const [priority, setPriority] = useState(2);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get(`/Tasks/${taskId}`);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setStatus(data.status || 1);
        setPriority(data.priority || 2);
        setDueDate(data.dueDate ? new Date(data.dueDate) : new Date());
        setAssignee(data.assignments && data.assignments.length > 0 ? data.assignments[0].userId : '');
        setProjectId(data.projectId || '');
      } catch (error) {
        Alert.alert('Hata', 'Görev detayları yüklenemedi.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/User');
        setUsers(response);
      } catch (error) {
        console.error('Kullanıcılar yüklenemedi:', error);
      }
    };
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/projects');
        setProjects(response);
        if (!projectId && response.length > 0) setProjectId(response[0].id);
      } catch (error) {
        console.error('Projeler yüklenemedi:', error);
      }
    };
    fetchTask();
    fetchUsers();
    fetchProjects();
  }, [taskId]);

  const handleUpdateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen görev başlığını girin.');
      return;
    }
    if (!projectId) {
      Alert.alert('Hata', 'Lütfen bir proje seçin.');
      return;
    }
    setLoading(true);
    try {
      const taskData = {
        id: taskId,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate.toISOString(),
        assignedUserIds: assignee ? [assignee] : [],
        projectId,
      };
      await apiClient.put('/Tasks', taskData);
      Alert.alert('Başarılı', 'Görev güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Hata', error?.response?.data?.message || error.message || 'Görev güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Başlık *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Görev başlığı"
          maxLength={100}
        />
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Görev açıklaması"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Text style={styles.label}>Durum</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            onValueChange={setStatus}
            style={styles.picker}
          >
            {statusOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Öncelik</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={priority}
            onValueChange={setPriority}
            style={styles.picker}
          >
            {priorityOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Bitiş Tarihi</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {dueDate.toLocaleDateString('tr-TR')}
          </Text>
          <Ionicons name="calendar" size={20} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.label}>Atanan Kişi</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={assignee}
            onValueChange={setAssignee}
            style={styles.picker}
          >
            <Picker.Item label="Seçiniz" value="" />
            {users.map((user) => (
              <Picker.Item
                key={user.id}
                label={`${user.name} ${user.surname}`}
                value={user.id}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Proje</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={projectId}
            onValueChange={setProjectId}
            style={styles.picker}
          >
            {projects.map((project) => (
              <Picker.Item key={project.id} label={project.name} value={project.id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdateTask}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Görevi Güncelle</Text>
          )}
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF6EC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FCF6EC' },
  form: { padding: 20 },
  label: { fontWeight: 'bold', fontSize: 16, color: '#1A73E8', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerContainer: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  picker: { height: 50 },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10, marginBottom: 16 },
  dateButtonText: { color: '#1A73E8', fontWeight: 'bold', marginRight: 8 },
  updateButton: { backgroundColor: '#1A73E8', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  updateButtonDisabled: { backgroundColor: '#93c5fd' },
  updateButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default TaskEditScreen; 