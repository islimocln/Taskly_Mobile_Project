import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetProjectByIdQuery, useGetProjectStatsQuery } from '../Apis/ProjectApi';
import { useNavigation } from '@react-navigation/native';

const ProjectDetail = ({ route }) => {
  const { projectId } = route.params;
  const navigation = useNavigation();
  
  const { data: project, isLoading: isProjectLoading } = useGetProjectByIdQuery(projectId);
  const { data: stats, isLoading: isStatsLoading } = useGetProjectStatsQuery(projectId);

  if (isProjectLoading || isStatsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text>Proje bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.projectName}>{project.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ProjectEdit', { projectId })}
          >
            <Ionicons name="create-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
        </View>
        <View style={[styles.statusBadge, styles[`status${project.status}`]]}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proje Detayları</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.detailLabel}>Başlangıç:</Text>
            <Text style={styles.detailValue}>{project.startDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.detailLabel}>Bitiş:</Text>
            <Text style={styles.detailValue}>{project.deadline}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="flag-outline" size={20} color="#666" />
            <Text style={styles.detailLabel}>Öncelik:</Text>
            <View style={[styles.priorityBadge, styles[`priority${project.priority}`]]}>
              <Text style={styles.priorityText}>{project.priority}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{project.description}</Text>
        </View>
      </View>

      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalTasks}</Text>
              <Text style={styles.statLabel}>Toplam Görev</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.completedTasks}</Text>
              <Text style={styles.statLabel}>Tamamlanan</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.inProgressTasks}</Text>
              <Text style={styles.statLabel}>Devam Eden</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{`%${stats.completionRate}`}</Text>
              <Text style={styles.statLabel}>Tamamlanma</Text>
            </View>
          </View>
        </View>
      )}
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
  projectName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  descriptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A73E8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPlanning: {
    backgroundColor: '#ffc107',
  },
  statusInProgress: {
    backgroundColor: '#1A73E8',
  },
  statusCompleted: {
    backgroundColor: '#28a745',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityHigh: {
    backgroundColor: '#dc3545',
  },
  priorityMedium: {
    backgroundColor: '#ffc107',
  },
  priorityLow: {
    backgroundColor: '#28a745',
  },
  priorityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProjectDetail; 