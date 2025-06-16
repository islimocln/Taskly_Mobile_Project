import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Linking, Modal, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/apiClient';

const DocumentsScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
    fetchProjects();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/ProjectDocuments');
      console.log('API DÖNEN:', response);
      setDocuments(response);
    } catch (err) {
      setError('Dokümanlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects');
      setProjects(response.data || response);
    } catch (err) {
      setProjects([]);
    }
  };

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') {
      setSelectedFile(result);
    }
  };

  const handleUpload = async () => {
    if (!selectedProject || !description.trim() || !selectedFile) {
      Alert.alert('Lütfen tüm alanları doldurun ve dosya seçin.');
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('projectId', selectedProject);
      formData.append('description', description.trim());
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'application/octet-stream',
      });
      await apiClient.post('/ProjectDocuments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Başarılı', 'Dosya yüklendi!');
      setUploadModal(false);
      setSelectedProject('');
      setDescription('');
      setSelectedFile(null);
      fetchDocuments();
    } catch (err) {
      Alert.alert('Hata', 'Dosya yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (doc) => {
    const url = `${apiClient.defaults.baseURL}/ProjectDocuments/download/${doc.id}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="document-text-outline" size={28} color="#1A73E8" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.fileName}</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.date}>Eklenme: {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString('tr-TR') : '-'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDownload(item)} style={styles.iconBtn}>
          <Ionicons name="download-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { marginTop: 80 }]}>Dokümanlar</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={() => setUploadModal(true)}>
        <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
        <Text style={styles.uploadBtnText}>Dosya Yükle</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#1A73E8" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={item => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Henüz doküman yok.</Text>}
        />
      )}
      <Modal
        visible={uploadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Doküman Yükle</Text>
            <Text style={styles.label}>Proje Seç</Text>
            <View style={styles.selectBox}>
              {projects.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.projectBtn,
                    selectedProject === item.id && styles.projectBtnSelected,
                  ]}
                  onPress={() => setSelectedProject(item.id)}
                >
                  <Text style={selectedProject === item.id ? styles.projectBtnTextSelected : styles.projectBtnText}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={styles.input}
              placeholder="Açıklama girin"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.fileBtn} onPress={handleFilePick}>
              <Ionicons name="document-attach-outline" size={20} color="#1A73E8" />
              <Text style={styles.fileBtnText}>{selectedFile ? selectedFile.name : 'Dosya Seç'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadBtn, uploading && { opacity: 0.7 }]}
              onPress={handleUpload}
              disabled={uploading}
            >
              <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
              <Text style={styles.uploadBtnText}>{uploading ? 'Yükleniyor...' : 'Yükle'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setUploadModal(false)}>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1A73E8' },
  desc: { fontSize: 13, color: '#555', marginTop: 2 },
  date: { fontSize: 12, color: '#888', marginTop: 4 },
  iconBtn: { marginLeft: 10, padding: 6 },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  uploadBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  empty: { textAlign: 'center', marginTop: 30, color: '#aaa' },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 18,
  },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  cancelBtnText: {
    color: '#1A73E8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 8,
  },
  selectBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  projectBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#1A73E8',
    borderRadius: 8,
  },
  projectBtnSelected: {
    backgroundColor: '#1A73E8',
  },
  projectBtnText: {
    color: '#1A73E8',
    fontWeight: 'bold',
  },
  projectBtnTextSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1A73E8',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  fileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  fileBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DocumentsScreen; 