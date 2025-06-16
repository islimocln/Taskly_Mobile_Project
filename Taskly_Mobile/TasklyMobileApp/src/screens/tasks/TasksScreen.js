import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, deleteTask } from '../../store/slices/taskSlice';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';

const statusMap = {
  1: { label: 'Beklemede', color: '#2196F3', icon: 'pause-circle' },
  2: { label: 'Aktif', color: '#FF9800', icon: 'play-circle' },
  3: { label: 'Tamamlandı', color: '#4CAF50', icon: 'checkmark-circle' },
};

const priorityMap = {
  1: { label: 'Düşük', color: '#4CAF50', icon: 'arrow-down' },
  2: { label: 'Orta', color: '#FF9800', icon: 'remove' },
  3: { label: 'Yüksek', color: '#F44336', icon: 'arrow-up' },
};

const TasksScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: tasks, loading, error } = useSelector(state => state.tasks);
  const [projects, setProjects] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchTasks());
    }, [dispatch])
  );

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/projects');
        setProjects(response);
      } catch (error) {
        // Proje çekilemezse sessiz geç
      }
    };
    fetchProjects();
  }, []);

  const handleDeleteTask = async (taskId) => {
    Alert.alert('Görevi Sil', 'Bu görevi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          await dispatch(deleteTask(taskId));
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
    const status = statusMap[item.status] || { label: 'Bilinmiyor', color: '#9E9E9E', icon: 'help-circle' };
    const priority = priorityMap[item.priority] || { label: 'Belirsiz', color: '#9E9E9E', icon: 'help-circle' };
    const assigneeName = item.assignments && item.assignments.length > 0
      ? item.assignments.map(a => a.userName).join(', ')
      : 'Atanmamış';
    const assigneeInitial = item.assignments && item.assignments.length > 0
      ? item.assignments[0].userName?.[0]
      : '?';
    const project = projects.find(p => p.id === item.projectId);
    return (
      <View style={styles.taskCard}>
        <View style={styles.cardHeaderRow}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
            <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
            {item.status === 3 && (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{ marginLeft: 4 }} />
            )}
          </View>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => navigation.navigate('TaskEdit', { taskId: item.id })}>
              <Ionicons name="pencil" size={18} color="#1A73E8" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={{ marginLeft: 8 }}>
              <Ionicons name="trash" size={18} color="#E53935" />
            </TouchableOpacity>
          </View>
        </View>
        {project && (
          <Text style={styles.projectName}>{project.name}</Text>
        )}
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: status.color }]}> 
            <Ionicons name={status.icon} size={14} color="#fff" />
            <Text style={styles.tagTextSmall}>{status.label}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: priority.color }]}> 
            <Ionicons name={priority.icon} size={14} color="#fff" />
            <Text style={styles.tagTextSmall}>{priority.label}</Text>
          </View>
        </View>
        <View style={styles.taskFooter}>
          <View style={styles.assigneeInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{assigneeInitial}</Text>
            </View>
            <Text style={styles.assigneeName}>{assigneeName}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Ionicons name="calendar" size={14} color="#666" style={styles.dateIcon} />
            <Text style={styles.dueDate}>
              {item.dueDate ? new Date(item.dueDate).toLocaleDateString('tr-TR') : '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { marginTop: 40 }]}>Görevler</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1A73E8" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Henüz görev yok.</Text>}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateTask')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF6EC' },
  header: { fontSize: 24, fontWeight: 'bold', margin: 20, color: '#1A73E8' },
  list: { paddingHorizontal: 16, paddingBottom: 80 }, 
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  taskTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A73E8', flexShrink: 1 },
  taskDesc: { fontSize: 14, color: '#444', marginVertical: 6 },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tagRow: { flexDirection: 'row', marginTop: 8, marginBottom: 6 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    minWidth: 0,
  },
  tagText: { color: '#fff', marginLeft: 5, fontWeight: '600' },
  tagTextSmall: { color: '#fff', marginLeft: 4, fontWeight: '600', fontSize: 12 },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assigneeInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  assigneeName: { fontSize: 14, color: '#555', marginLeft: 10 },
  dateInfo: { flexDirection: 'row', alignItems: 'center' },
  dateIcon: { marginRight: 5 },
  dueDate: { fontSize: 13, color: '#666' },
  empty: { textAlign: 'center', marginTop: 30, color: '#aaa' },
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
  },
  projectName: { fontSize: 13, color: '#888', marginTop: 2, marginBottom: 2, marginLeft: 2 },
});

export default TasksScreen; 