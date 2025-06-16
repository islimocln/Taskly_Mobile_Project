import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiClient from '../../api/apiClient';

const statusOptions = [
  { label: 'Aktif', value: 2 },
  { label: 'Beklemede', value: 1 },
  { label: 'Tamamlandı', value: 3 },
];

const CreateProject = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(2);
  const [endDate, setEndDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  const handleCreate = async () => {
    if (!name || !description || !status || !endDate) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      setLoading(true);
      await apiClient.post('/projects', {
        name,
        description,
        status,
        dueDate: endDate.toISOString(),
      });
      Alert.alert('Başarılı', 'Proje oluşturuldu!');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Hata',
        error.response?.data?.message || error.message || 'Proje oluşturulamadı.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Proje</Text>
      <TextInput
        style={styles.input}
        placeholder="Proje Adı"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Açıklama"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <View style={styles.pickerContainer}>
        <Ionicons name="list" size={20} color="#1A73E8" style={{ marginRight: 8 }} />
        <Text style={styles.pickerLabel}>Durum:</Text>
        {statusOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.statusOption, status === opt.value && styles.statusOptionSelected]}
            onPress={() => setStatus(opt.value)}
          >
            <Text style={[styles.statusOptionText, status === opt.value && { color: '#fff' }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDate(true)}>
        <Ionicons name="calendar" size={20} color="#1A73E8" style={{ marginRight: 8 }} />
        <Text style={styles.dateText}>
          Bitiş Tarihi: {endDate ? endDate.toLocaleDateString('tr-TR') : 'Seçiniz'}
        </Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>İptal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.createButton, loading && { backgroundColor: '#93c5fd' }]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.createText}>Oluştur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF6EC', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A73E8', marginBottom: 18, textAlign: 'center' },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
    padding: 8,
    flexWrap: 'wrap',
  },
  pickerLabel: { fontSize: 16, color: '#1A73E8', marginRight: 8 },
  statusOption: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  statusOptionSelected: { backgroundColor: '#1A73E8' },
  statusOptionText: { color: '#1A73E8', fontWeight: 'bold', fontSize: 15 },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    marginBottom: 16,
  },
  dateText: { fontSize: 16, color: '#1A73E8' },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 10,
  },
  cancelText: { color: '#1A73E8', fontWeight: 'bold', fontSize: 16 },
  createButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CreateProject;
