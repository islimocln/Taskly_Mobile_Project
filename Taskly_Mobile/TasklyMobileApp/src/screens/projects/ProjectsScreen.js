import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/apiClient';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

const statusMap = {
  1: { color: '#F2C94C', label: 'Beklemede', iconBg: '#FFF9E5' },
  2: { color: '#219653', label: 'Aktif', iconBg: '#E6F4EA' },
  3: { color: '#2D9CDB', label: 'Tamamlandı', iconBg: '#E5F0FA' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR');
};

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Silme işlemi için loading state
  const [deletingId, setDeletingId] = useState(null);

  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docProjectId, setDocProjectId] = useState(null);
  const [docDescription, setDocDescription] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [docUploading, setDocUploading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchProjects = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await apiClient.get('/projects');
          if (isActive) setProjects(response);
        } catch (err) {
          if (isActive) setError('Projeler yüklenemedi.');
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchProjects();
      return () => { isActive = false; };
    }, [])
  );

  // Proje silme fonksiyonu
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await apiClient.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      Alert.alert('Hata', 'Proje silinirken bir hata oluştu.');
    } finally {
      setDeletingId(null);
    }
  };

  const openDocModal = (projectId) => {
    setDocProjectId(projectId);
    setDocDescription('');
    setDocFile(null);
    setDocModalVisible(true);
  };

  const closeDocModal = () => {
    setDocModalVisible(false);
    setDocProjectId(null);
    setDocDescription('');
    setDocFile(null);
  };

  const handleDocFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') {
      setDocFile(result);
    }
  };

  const handleDocUpload = async () => {
    if (!docDescription.trim() || !docFile) {
      Alert.alert('Lütfen açıklama girin ve dosya seçin.');
      return;
    }
    try {
      setDocUploading(true);
      const formData = new FormData();
      formData.append('projectId', docProjectId);
      formData.append('description', docDescription.trim());
      formData.append('file', {
        uri: docFile.uri,
        name: docFile.name,
        type: docFile.mimeType || 'application/octet-stream',
      });
      await apiClient.post('/ProjectDocuments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Başarılı', 'Doküman yüklendi!');
      closeDocModal();
    } catch (err) {
      Alert.alert('Hata', 'Doküman yüklenemedi.');
    } finally {
      setDocUploading(false);
    }
  };

  const renderItem = ({ item }) => {
    const status = statusMap[item.status] || { color: '#BDBDBD', label: 'Bilinmiyor', iconBg: '#F0F0F0' };
    // Açıklamayı kısalt
    const shortDesc = item.description && item.description.length > 100
      ? item.description.substring(0, 100) + '...'
      : item.description || 'Açıklama yok.';
    return (
      <View style={styles.projectCard}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.navigate('projectDetail', { projectId: item.id })}>
            <View style={[styles.iconCircle, { backgroundColor: status.iconBg }] }>
              <Ionicons name="information-circle" size={32} color={status.color} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.projectTitle}>{item.name}</Text>
            <Text style={styles.projectDesc}>{shortDesc}</Text>
            <View style={styles.infoRow}>
              <View style={[styles.statusTag, { backgroundColor: status.color }] }>
                <Text style={styles.statusText}>{status.label}</Text>
              </View>
              <View style={styles.dateTag}>
                <Text style={styles.dateText}>Bitiş: {formatDate(item.endDate)}</Text>
              </View>
              <View style={styles.dateTag}>
                <Text style={styles.dateText}>Oluşturulma: {formatDate(item.createdAt)}</Text>
              </View>
            </View>
          </View>
          {/* Sağ üstte ikonlar */}
          <View style={styles.iconGroup}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Alert.alert(
                  'Projeyi Sil',
                  'Bu projeyi silmek istediğinize emin misiniz?',
                  [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Sil', style: 'destructive', onPress: () => handleDelete(item.id) },
                  ]
                );
              }}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? (
                <ActivityIndicator size={18} color="#E53935" />
              ) : (
                <Ionicons name="trash-outline" size={22} color="#E53935" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => openDocModal(item.id)}
            >
              <Ionicons name="attach-outline" size={22} color="#1A73E8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { marginTop: 32 }]}>Projeler</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1A73E8" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id?.toString() || item._id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Henüz proje yok.</Text>}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateProject')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal
        visible={docModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDocModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Doküman Yükle</Text>
            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={styles.input}
              placeholder="Açıklama girin"
              value={docDescription}
              onChangeText={setDocDescription}
            />
            <TouchableOpacity style={styles.fileBtn} onPress={handleDocFilePick}>
              <Ionicons name="document-attach-outline" size={20} color="#1A73E8" />
              <Text style={styles.fileBtnText}>{docFile ? docFile.name : 'Dosya Seç'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadBtn, docUploading && { opacity: 0.7 }]}
              onPress={handleDocUpload}
              disabled={docUploading}
            >
              <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
              <Text style={styles.uploadBtnText}>{docUploading ? 'Yükleniyor...' : 'Yükle'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeDocModal}>
              <Text style={styles.cancelBtnText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF6EC' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1A73E8', margin: 20 },
  list: { paddingHorizontal: 16, paddingBottom: 80 },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  projectTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A73E8' },
  projectDesc: { fontSize: 15, color: '#444', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  statusTag: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginRight: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 13, textTransform: 'capitalize' },
  dateTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
    marginTop: 4,
  },
  dateText: { color: '#555', fontSize: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#1A73E8',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  iconButton: {
    marginHorizontal: 2,
    padding: 4,
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A73E8', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1A73E8', marginBottom: 10 },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#1A73E8',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  fileBtn: {
    backgroundColor: '#1A73E8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  fileBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  uploadBtn: {
    backgroundColor: '#1A73E8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: {
    backgroundColor: '#E53935',
    padding: 10,
    borderRadius: 5,
  },
  cancelBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ProjectsScreen; 