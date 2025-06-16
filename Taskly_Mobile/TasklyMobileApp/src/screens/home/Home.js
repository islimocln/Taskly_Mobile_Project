import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import apiClient from '../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const today = new Date();
const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} ${days[today.getDay()]}`;

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    openTasks: 0,
    dueToday: 0
  });
  const [notifVisible, setNotifVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchData();
    getUserEmail();
  }, []);

  const getUserEmail = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserEmail(user.email || '');
      } catch {}
    }
  };

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      let userId = '';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id || user.userId || '';
        } catch {}
      }
      if (!userId) throw new Error('Kullanıcı ID bulunamadı');
      const response = await apiClient.get(`/notifications/user/${userId}`);
      setNotifications(response);
    } catch (e) {
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleNotifPress = () => {
    setNotifVisible(true);
    fetchNotifications();
  };

  const handleUserPress = () => {
    setUserMenuVisible(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const projectsResponse = await apiClient.get('/projects');
      // Son 3 projeyi al
      const recentProjects = projectsResponse.slice(0, 3);
      // Her proje için detaydan progress çek
      const projectsWithProgress = await Promise.all(
        recentProjects.map(async (project) => {
          try {
            const detail = await apiClient.get(`/projects/${project.id}`);
            let progress = 0;
            if (detail.progress !== undefined) {
              progress = detail.progress;
            } else if (detail.tasks && Array.isArray(detail.tasks) && detail.tasks.length > 0) {
              const completed = detail.tasks.filter(t => t.status === 3).length; // 3: Tamamlandı
              progress = completed / detail.tasks.length;
            }
            return {
              name: project.name,
              progress
            };
          } catch {
            return {
              name: project.name,
              progress: 0
            };
          }
        })
      );
      setProjects(projectsWithProgress);
      // İstatistikleri hesapla
      const tasksResponse = await apiClient.get('/tasks');
      const activeProjects = projectsResponse.filter(p => p.status === 2).length;
      const openTasks = tasksResponse.filter(t => t.status !== 4).length;
      const dueToday = tasksResponse.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate.toDateString() === today.toDateString();
      }).length;

      setStats({
        activeProjects,
        openTasks,
        dueToday
      });
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: 'add-circle-outline', label: 'Yeni Proje', onPress: () => navigation.navigate('CreateProject') },
    { icon: 'create-outline', label: 'Yeni Görev', onPress: () => navigation.navigate('Görevler') },
    { icon: 'people-outline', label: 'Yeni Takım', onPress: () => navigation.navigate('Takımlar') },
    { icon: 'document-outline', label: 'Döküman', onPress: () => navigation.navigate('Dökümanlar') },
  ];

  const handleDeleteNotification = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch {}
  };

  const handleDeleteAllNotifications = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      let userId = '';
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id || user.userId || '';
        } catch {}
      }
      if (!userId) return;
      await apiClient.delete(`/notifications/user/${userId}`);
      fetchNotifications();
    } catch {}
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.openDrawer?.() || {}}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ana Sayfa</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleNotifPress} style={{ marginRight: 12 }}>
              <Ionicons name="notifications-outline" size={26} color="#fff" />
              {notifications.length > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{notifications.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUserPress}>
              <View style={styles.userCircle}>
                <Text style={styles.userInitial}>{userEmail?.[0]?.toUpperCase() || 'U'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.welcomeText}>Hoş geldin, islim!</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.statsBoxRow}>
          <View style={styles.statsBox}>
            <Ionicons name="folder-open" size={24} color="#1A73E8" style={{ marginBottom: 4 }} />
            <Text style={styles.statsValue}>{stats.activeProjects}</Text>
            <Text style={styles.statsLabel}>Aktif Projeler</Text>
          </View>
          <View style={styles.statsBox}>
            <Ionicons name="checkmark-done" size={24} color="#10B981" style={{ marginBottom: 4 }} />
            <Text style={styles.statsValue}>{stats.openTasks}</Text>
            <Text style={styles.statsLabel}>Açık Görevler</Text>
          </View>
          <View style={styles.statsBox}>
            <Ionicons name="calendar" size={24} color="#F59E0B" style={{ marginBottom: 4 }} />
            <Text style={styles.statsValue}>{stats.dueToday}</Text>
            <Text style={styles.statsLabel}>Bugün Son Tarihli</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Projeler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Projeler')}>
            <Text style={styles.link}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {projects.map((p, i) => (
          <View key={i} style={styles.projectRow}>
            <Text style={styles.projectName}>{p.name}</Text>
            <Text style={styles.projectPercent}>{Math.round(p.progress * 100)}%</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${p.progress * 100}%` }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionButton}
              onPress={action.onPress}
            >
              <Ionicons name={action.icon} size={24} color="#1A73E8" />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal
        visible={notifVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotifVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setNotifVisible(false)}>
          <View style={styles.notifModal}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.notifTitle}>Bildirimler</Text>
            </View>
            {notifLoading ? (
              <ActivityIndicator size="small" color="#1A73E8" />
            ) : notifications.length === 0 ? (
              <Text style={styles.notifEmpty}>Bildirim yok.</Text>
            ) : (
              notifications.map((n, i) => (
                <View key={i} style={[styles.notifItem, { flexDirection: 'row', alignItems: 'center' }] }>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifText}>{n.message}</Text>
                    <Text style={styles.notifDate}>{n.date ? new Date(n.date).toLocaleString('tr-TR') : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteNotification(n.id)}>
                    <Ionicons name="close-circle" size={20} color="#E53935" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={userMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUserMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setUserMenuVisible(false)}>
          <View style={styles.userMenuModal}>
            <Text style={styles.userMenuMail}>{userEmail}</Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#E53935" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8FB'
  },
  headerBg: {
    backgroundColor: '#1A73E8',
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  welcomeText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  dateText: { color: '#E3EFFF', fontSize: 15, marginBottom: 18 },
  statsBoxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statsBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statsValue: { color: '#1A73E8', fontSize: 20, fontWeight: 'bold' },
  statsLabel: { color: '#666', fontSize: 13, marginTop: 2, textAlign: 'center' },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A73E8' },
  link: { color: '#1A73E8', fontWeight: 'bold', fontSize: 14 },
  projectRow: { marginBottom: 16 },
  projectName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  projectPercent: { position: 'absolute', right: 0, top: 0, color: '#1A73E8', fontWeight: 'bold', fontSize: 15 },
  progressBarBg: { height: 7, backgroundColor: '#E5E7EB', borderRadius: 4, marginTop: 8 },
  progressBar: { height: 7, backgroundColor: '#1A73E8', borderRadius: 4 },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -8,
  },
  quickActionButton: {
    width: '50%',
    padding: 8,
  },
  quickActionText: {
    color: '#1A73E8',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  userCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  userInitial: { color: '#1A73E8', fontWeight: 'bold', fontSize: 18 },
  notifBadge: { position: 'absolute', top: -4, right: -6, backgroundColor: '#E53935', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  notifModal: { position: 'absolute', top: 60, right: 20, width: 260, backgroundColor: '#F5F8FE', borderRadius: 12, padding: 16, elevation: 8 },
  notifTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, color: '#1A73E8' },
  notifEmpty: { color: '#888', textAlign: 'center', marginVertical: 16 },
  notifItem: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 8 },
  notifText: { color: '#222', fontSize: 14 },
  notifDate: { color: '#888', fontSize: 12, marginTop: 2 },
  userMenuModal: { position: 'absolute', top: 60, right: 20, width: 200, backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 8, alignItems: 'flex-start' },
  userMenuMail: { color: '#1A73E8', fontWeight: 'bold', fontSize: 15, marginBottom: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  logoutText: { color: '#E53935', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
});

export default Home; 