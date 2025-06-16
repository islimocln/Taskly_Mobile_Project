import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApiClient from '../../api/apiClient';
import { ProgressBar } from 'react-native-paper';

const ProjectDetail = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAllDetails();
  }, [projectId]);

  const fetchAllDetails = async () => {
    try {
      setIsLoading(true);
      const [projectRes, teamsRes, docsRes, tasksRes] = await Promise.all([
        ApiClient.get(`/projects/${projectId}`),
        ApiClient.get(`/ProjectTeams/project/${projectId}`),
        ApiClient.get(`/ProjectDocuments/project/${projectId}`),
        ApiClient.get(`/tasks/project/${projectId}`),
      ]);
      setProject(projectRes);
      setTeams(teamsRes);
      setDocuments(docsRes);
      setTasks(tasksRes);
    } catch (error) {
      Alert.alert('Hata', 'Proje detayları yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // İlerleme oranı hesapla
  const completedTasks = tasks.filter(t => t.status === 3).length; // 3: Tamamlandı
  const progress = tasks.length > 0 ? completedTasks / tasks.length : 0;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Proje bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.status}>{project.status === 2 ? 'Aktif' : project.status === 1 ? 'Beklemede' : project.status === 3 ? 'Tamamlandı' : 'Durum Bilinmiyor'}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ProjectEdit', { projectId })}
          >
            <Ionicons name="create-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={async () => {
              Alert.alert(
                'Projeyi Sil',
                'Bu projeyi silmek istediğinizden emin misiniz?',
                [
                  { text: 'İptal', style: 'cancel' },
                  { text: 'Sil', style: 'destructive', onPress: async () => {
                    try {
                      await ApiClient.delete(`/projects/${projectId}`);
                      navigation.goBack();
                    } catch (error) {
                      Alert.alert('Hata', 'Proje silinirken bir hata oluştu.');
                    }
                  } },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{project.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarihler</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Bitiş</Text>
            <Text style={styles.dateValue}>{project.dueDate ? new Date(project.dueDate).toLocaleDateString('tr-TR') : '-'}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Oluşturulma</Text>
            <Text style={styles.dateValue}>{project.createdAt ? new Date(project.createdAt).toLocaleDateString('tr-TR') : '-'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atanmış Takımlar</Text>
        {teams.length === 0 ? (
          <Text style={{ color: '#888' }}>Takım yok</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {teams.map((team) => (
              <View key={team.id} style={{ backgroundColor: '#E3EFFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 }}>
                <Text style={{ color: '#1A73E8', fontWeight: 'bold' }}>{team.teamName}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dokümanlar</Text>
        {documents.length === 0 ? (
          <Text style={{ color: '#888' }}>Doküman yok</Text>
        ) : (
          documents.map((doc) => (
            <View key={doc.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="document-text-outline" size={20} color="#1A73E8" style={{ marginRight: 8 }} />
              <Text style={{ color: '#1A73E8', fontWeight: 'bold', flex: 1 }}>{doc.fileName}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>{doc.description}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Görevler ve İlerleme</Text>
        <Text style={{ color: '#1A73E8', fontWeight: 'bold', marginBottom: 8 }}>Tamamlanma: {Math.round(progress * 100)}%</Text>
        <ProgressBar progress={progress} color="#1A73E8" style={{ height: 8, borderRadius: 4, marginBottom: 12 }} />
        {tasks.length === 0 ? (
          <Text style={{ color: '#888' }}>Görev yok</Text>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={{ backgroundColor: task.status === 3 ? '#C8F7C5' : '#F8FAFC', borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <Text style={{ color: '#1A73E8', fontWeight: 'bold' }}>{task.title}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>{task.description}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6EC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF6EC',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF6EC',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 8,
  },
  section: {
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#1A73E8',
    fontWeight: '500',
  },
  membersList: {
    marginTop: 8,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    color: '#1A73E8',
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  tasksList: {
    marginTop: 8,
  },
  taskItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A73E8',
  },
  taskStatus: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProjectDetail;

