import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetDocumentByIdQuery } from '../Apis/DocumentApi';
import { useNavigation } from '@react-navigation/native';

const DocumentDetail = ({ route }) => {
  const { documentId } = route.params;
  const navigation = useNavigation();
  
  const { data: document, isLoading } = useGetDocumentByIdQuery(documentId);

  const handleDownload = async () => {
    if (document?.fileUrl) {
      try {
        await Linking.openURL(document.fileUrl);
      } catch (error) {
        Alert.alert('Hata', 'Dosya açılırken bir hata oluştu');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.errorContainer}>
        <Text>Döküman bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A73E8" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('DocumentEdit', { documentId })}
          >
            <Ionicons name="create-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
        </View>
        <Text style={styles.documentTitle}>{document.title}</Text>
        <Text style={styles.documentType}>{document.type.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{document.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Döküman Bilgileri</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Oluşturulma Tarihi</Text>
            <Text style={styles.infoValue}>{new Date(document.createdAt).toLocaleDateString('tr-TR')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Yükleyen</Text>
            <Text style={styles.infoValue}>{document.uploadedBy}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="document-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Boyut</Text>
            <Text style={styles.infoValue}>{document.size}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="download-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>İndirme Sayısı</Text>
            <Text style={styles.infoValue}>{document.downloadCount}</Text>
          </View>
        </View>
      </View>

      {document.type === 'image' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Önizleme</Text>
          <Image
            source={{ uri: document.fileUrl }}
            style={styles.preview}
            resizeMode="contain"
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownload}
      >
        <Ionicons name="download-outline" size={24} color="#FFF" />
        <Text style={styles.downloadButtonText}>İndir</Text>
      </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  section: {
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DocumentDetail; 