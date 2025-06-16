import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, deleteNotification, deleteAllNotifications } from '../../store/slices/notificationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/apiClient';
// Kullanıcı bilgilerini almak için örnek bir user objesi (gerçek uygulamada redux veya context'ten alınır)
const user = {
  name: 'İslim Öcalan',
  email: 'islim@example.com',
  role: 'Üye',
  description: 'Taskly platformunda aktif bir üyeyim. Proje yönetimi ve takım çalışmasında deneyimliyim.'
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const { theme, mode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.items);
  const notificationsLoading = useSelector(state => state.notifications.loading);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap', style: 'destructive', onPress: () => {
          // Burada token ve user bilgilerini temizle, login ekranına yönlendir
          // AsyncStorage.removeItem('token');
          // AsyncStorage.removeItem('user');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]);
  };

  const handleNotifications = async () => {
    let userId = '';
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id || user.userId || '';
      }
    } catch {}
    if (!userId) return;
    setNotificationsModalVisible(true);
    dispatch(fetchNotifications(userId));
  };

  const handleDeleteNotification = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      // Bildirimleri tekrar çek
      let userId = '';
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          userId = user.id || user.userId || '';
        }
      } catch {}
      if (userId) dispatch(fetchNotifications(userId));
    } catch {}
  };

  const handleDeleteAllNotifications = () => {
    dispatch(deleteAllNotifications(userId));
  };

  const handleTheme = () => {
    toggleTheme();
    Alert.alert('Tema', `Tema ${mode === 'light' ? 'Koyu' : 'Açık'} moda geçti!`);
  };
  const handleLanguage = () => {
    Alert.alert('Dil', 'Dil seçimi yakında eklenecek!');
  };
  const handleAbout = () => {
    Alert.alert('Hakkında', 'Taskly v1.0.0\nTüm hakları saklıdır.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Ayarlar</Text>
      <TouchableOpacity style={styles.item} onPress={() => setProfileModalVisible(true)}>
        <Ionicons name="person-circle" size={28} color="#1A73E8" style={styles.icon} />
        <Text style={styles.itemText}>Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleNotifications}>
        <Ionicons name="notifications" size={24} color="#FF9800" style={styles.icon} />
        <Text style={styles.itemText}>Bildirimler</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleTheme}>
        <Ionicons name="color-palette" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.itemText}>Tema</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleLanguage}>
        <Ionicons name="language" size={24} color="#2196F3" style={styles.icon} />
        <Text style={styles.itemText}>Dil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleAbout}>
        <Ionicons name="information-circle" size={24} color="#9C27B0" style={styles.icon} />
        <Text style={styles.itemText}>Hakkında</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={handleLogout}>
        <Ionicons name="log-out" size={28} color="#E53935" style={styles.icon} />
        <Text style={styles.itemText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.modalBg }] }>
          <View style={[styles.modalContent, { backgroundColor: theme.card }] }>
            <Ionicons name="person-circle" size={64} color={theme.icon} style={{ alignSelf: 'center' }} />
            <Text style={[styles.profileName, { color: theme.text }]}>{user.name}</Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]}><Ionicons name="mail" size={16} color={theme.icon} />  {user.email}</Text>
            <Text style={[styles.profileRole, { color: theme.textSecondary }]}><Ionicons name="person" size={16} color={theme.icon} />  {user.role}</Text>
            <Text style={[styles.profileDesc, { color: theme.textSecondary }]}>{user.description}</Text>
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.button }]} onPress={() => setProfileModalVisible(false)}>
              <Text style={[styles.closeButtonText, { color: theme.buttonText }]}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={notificationsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNotificationsModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.modalBg }] }>
          <View style={[styles.modalContent, { backgroundColor: theme.card, minHeight: 300 }] }>
            <Text style={[styles.profileName, { color: theme.text, marginBottom: 12 }]}>Bildirimler</Text>
            {notificationsLoading ? (
              <Text style={{ color: theme.textSecondary }}>Yükleniyor...</Text>
            ) : notifications.length === 0 ? (
              <Text style={{ color: theme.textSecondary }}>Hiç bildiriminiz yok.</Text>
            ) : (
              notifications.map((n, i) => (
                <View key={n.id || i} style={{ marginBottom: 10, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.textSecondary, fontSize: 15 }}>{n.message || n.title || 'Bildirim'}</Text>
                    <Text style={{ color: theme.text, fontSize: 12, opacity: 0.7 }}>{n.date || ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteNotification(n.id)}>
                    <Ionicons name="close-circle" size={22} color="#E53935" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.button }]} onPress={() => setNotificationsModalVisible(false)}>
              <Text style={[styles.closeButtonText, { color: theme.buttonText }]}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF6EC', padding: 24 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1A73E8', marginBottom: 32 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#eee' },
  icon: { marginRight: 16 },
  itemText: { fontSize: 18, color: '#222' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '85%', alignItems: 'center', elevation: 8 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#1A73E8', marginTop: 12, marginBottom: 8 },
  profileEmail: { fontSize: 16, color: '#333', marginBottom: 4 },
  profileRole: { fontSize: 16, color: '#333', marginBottom: 12 },
  profileDesc: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 18 },
  closeButton: { backgroundColor: '#1A73E8', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default SettingsScreen; 