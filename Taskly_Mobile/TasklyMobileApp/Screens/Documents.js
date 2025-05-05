import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetDocumentsQuery, useDeleteDocumentMutation } from '../Apis/DocumentApi';
import { useNavigation } from '@react-navigation/native';

const Documents = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const { data: documents, isLoading, error } = useGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation();

  const handleDelete = async (documentId) => {
    Alert.alert(
      'Dökümanı Sil',
      'Bu dökümanı silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDocument(documentId).unwrap();
              Alert.alert('Başarılı', 'Döküman başarıyla silindi');
            } catch (error) {
              Alert.alert('Hata', 'Döküman silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const filteredDocuments = documents?.filter(doc => {
    if (selectedFilter === 'all') return true;
    return doc.type === selectedFilter;
  });

  const renderDocument = ({ item }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => navigation.navigate('DocumentDetail', { documentId: item.id })}
    >
      <View style={styles.documentHeader}>
        <Ionicons
          name={getDocumentIcon(item.type)}
          size={24}
          color="#1A73E8"
        />
        <Text style={styles.documentTitle}>{item.title}</Text>
      </View>
      
      <View style={styles.documentInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.uploadedBy}</Text>
        </View>
      </View>

      <View style={styles.documentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DocumentEdit', { documentId: item.id })}
        >
          <Ionicons name="create-outline" size={20} color="#1A73E8" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf':
        return 'document-text-outline';
      case 'image':
        return 'image-outline';
      case 'spreadsheet':
        return 'document-outline';
      default:
        return 'document-outline';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Dökümanlar yüklenirken bir hata oluştu</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace('Documents')}
        >
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            Tümü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'pdf' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('pdf')}
        >
          <Text style={[styles.filterText, selectedFilter === 'pdf' && styles.filterTextActive]}>
            PDF
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'image' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('image')}
        >
          <Text style={[styles.filterText, selectedFilter === 'image' && styles.filterTextActive]}>
            Resimler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'spreadsheet' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('spreadsheet')}
        >
          <Text style={[styles.filterText, selectedFilter === 'spreadsheet' && styles.filterTextActive]}>
            Tablolar
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDocuments}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz hiç döküman yüklenmemiş.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateDocument')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1A73E8',
    borderRadius: 4,
  },
  retryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  filterButtonActive: {
    backgroundColor: '#1A73E8',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContainer: {
    padding: 16,
  },
  documentCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Documents; 