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
  Modal,
  FlatList,
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

const CreateTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1);
  const [priority, setPriority] = useState(2);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [assignedUserId, setAssignedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

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
      if (response.length > 0) setProjectId(response[0].id);
    } catch (error) {
      console.error('Projeler yüklenemedi:', error);
    }
  };

  const handleUserToggle = (userId) => {
    if (assignedUserId === userId) {
      setAssignedUserId('');
    } else {
      setAssignedUserId(userId);
    }
  };

  const selectedUserNames = users
    .filter(u => assignedUserId === u.id)
    .map(u => `${u.name} ${u.surname}`)
    .join(', ');

  const handleCreateTask = async () => {
    if (!title.trim() || !description.trim() || !projectId || !assignedUserId) {
      Alert.alert('Lütfen tüm zorunlu alanları doldurun ve bir kişi seçin.');
      return;
    }
    setLoading(true);
    try {
      const taskData = {
        projectId,
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate ? dueDate.toISOString() : null,
        priority,
        assignedUserIds: assignedUserId ? [assignedUserId] : [],
      };
      await apiClient.post('/Tasks', taskData);
      Alert.alert('Başarılı', 'Görev oluşturuldu.', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Görev oluşturulamadı.');
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Görev Adı *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Görev Adı"
        />

        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Açıklama"
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

        <Text style={styles.label}>Atanan Kişi</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={assignedUserId}
            onValueChange={setAssignedUserId}
            style={styles.picker}
          >
            <Picker.Item label="Kişi Seçiniz" value="" />
            {users.map((user) => (
              <Picker.Item key={user.id} label={`${user.name} ${user.surname}`} value={user.id} />
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

        <Text style={styles.label}>Proje *</Text>
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
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateTask}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Kaydet</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FCF6EC',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateTaskScreen; 