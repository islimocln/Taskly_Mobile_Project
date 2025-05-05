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
import { useGetTaskByIdQuery } from '../Apis/TaskApi';
import { useNavigation } from '@react-navigation/native';

const TaskDetail = ({ route }) => {
  const { taskId } = route.params;
  const navigation = useNavigation();
  
  const { data: task, isLoading } = useGetTaskByIdQuery(taskId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text>Görev bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('TaskEdit', { taskId })}
          >
            <Ionicons name="create-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
        </View>
        <View style={[styles.statusBadge, styles[`status${task.status}`]]}>
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Görev Detayları</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.detailLabel}>Bitiş Tarihi:</Text>
            <Text style={styles.detailValue}>{task.deadline}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.detailLabel}>Atanan:</Text>
            <Text style={styles.detailValue}>{task.assignedTo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="flag-outline" size={20} color="#666" />
            <Text style={styles.detailLabel}>Öncelik:</Text>
            <View style={[styles.priorityBadge, styles[`priority${task.priority}`]]}>
              <Text style={styles.priorityText}>{task.priority}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      </View>
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
  taskTitle: {
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTodo: {
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

export default TaskDetail; 