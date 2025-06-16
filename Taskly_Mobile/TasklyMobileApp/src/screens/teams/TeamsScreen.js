import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/apiClient';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const titleMap = {
  1: { label: 'Takım Lideri', color: '#1976D2' },
  2: { label: 'Geliştirici', color: '#219653' },
  3: { label: 'Test Uzmanı', color: '#F2C94C' },
  4: { label: 'Tasarımcı', color: '#9C27B0' },
  5: { label: 'Analist', color: '#FF9800' },
  6: { label: 'Ürün Sahibi', color: '#E91E63' },
  7: { label: 'Scrum Master', color: '#1565C0' },
  8: { label: 'DevOps Uzmanı', color: '#00B8D4' },
  9: { label: 'Stajyer', color: '#BDBDBD' },
  10: { label: 'Yazılım Mimarı', color: '#607D8B' },
};

const TeamsScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedTitle, setSelectedTitle] = useState(2);
  const [users, setUsers] = useState([]);
  const [adding, setAdding] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchTeams = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await apiClient.get('/TeamMembers/GetTeamandMemebersForTeamsCard');
          console.log('API TAKIM VERİSİ:', response);
          if (isActive) setTeams(response);
        } catch (err) {
          if (isActive) setError('Takımlar yüklenemedi.');
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchTeams();
      return () => { isActive = false; };
    }, [])
  );

  const handleRemoveMember = async (teamId, memberId) => {
    console.log('Silinecek TeamMember id:', memberId);
    Alert.alert(
      'Üyeyi Sil',
      'Bu üyeyi takımdan çıkarmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil', style: 'destructive', onPress: async () => {
            try {
              await apiClient.delete(`/TeamMembers/${memberId}`);
              setTeams(prevTeams =>
                prevTeams.map(team =>
                  team.id === teamId
                    ? { ...team, members: team.members.filter(m => m.id !== memberId) }
                    : team
                )
              );
              Alert.alert('Başarılı', 'Üye silindi.');
            } catch (error) {
              Alert.alert('Hata', 'Üye silinemedi.');
            }
          }
        }
      ]
    );
  };

  const renderMember = (member, idx, teamId) => {
    const title = titleMap[member.title] || { label: 'Üye', color: '#BDBDBD' };
    const initials = (member.name?.[0] || '') + (member.surname?.[0] || '');
    return (
      <TouchableOpacity key={idx} style={styles.memberCard} onPress={() => handleRemoveMember(teamId, member.teamMemberId || member.id)}>
        <View style={{ position: 'relative', alignItems: 'center', overflow: 'visible' }}>
          <View style={[styles.avatar, { backgroundColor: title.color + '22' }] }>
            <Text style={{ color: title.color, fontWeight: 'bold', fontSize: 18 }}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.memberName}>{member.name} {member.surname}</Text>
        <View style={[styles.roleTag, { backgroundColor: title.color }] }>
          <Text style={styles.roleText}>{title.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDeleteTeam = async (teamId) => {
    Alert.alert('Takımı Sil', 'Bu takımı silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await apiClient.delete(`/teams/${teamId}`);
            setTeams((prev) => prev.filter((t) => t.id !== teamId));
            Alert.alert('Başarılı', 'Takım silindi.');
          } catch (error) {
            Alert.alert('Hata', 'Takım silinemedi.');
          }
        }
      }
    ]);
  };

  const openAddMemberModal = async (teamId) => {
    setSelectedTeamId(teamId);
    setSelectedUserId('');
    setSelectedTitle(2);
    setModalVisible(true);
    try {
      const response = await apiClient.get(`/TeamMembers/team/${teamId}/available-users`);
      setUsers(response);
    } catch (error) {
      setUsers([]);
    }
  };

  const handleAddMemberModal = async () => {
    if (!selectedUserId) {
      Alert.alert('Uyarı', 'Lütfen bir kullanıcı seçin.');
      return;
    }
    setAdding(true);
    try {
      let newMember;
      try {
        newMember = await apiClient.post('/TeamMembers', {
          teamId: selectedTeamId,
          userId: selectedUserId,
          title: selectedTitle,
        });
        console.log('Eklenen üye:', newMember);
      } catch (apiError) {
        newMember = null;
      }
      if (!newMember || !newMember.name || !newMember.surname) {
        const eklenenKullanici = users.find(u => u.id === selectedUserId);
        if (eklenenKullanici) {
          newMember = {
            ...newMember,
            name: eklenenKullanici.name,
            surname: eklenenKullanici.surname,
            title: selectedTitle
          };
        }
      }
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === selectedTeamId
            ? { ...team, members: [...team.members, newMember] }
            : team
        )
      );
      setModalVisible(false);
      Alert.alert('Başarılı', 'Üye eklendi.');
    } catch (error) {
      Alert.alert('Hata', 'Üye eklenemedi.');
    } finally {
      setAdding(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.teamCard}>
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.teamName}>{item.name}</Text>
          <Text style={styles.teamDesc}>{item.description || 'Açıklama yok.'}</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleDeleteTeam(item.id)} style={styles.iconBtn}>
            <Ionicons name="trash" size={22} color="#E53935" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openAddMemberModal(item.id)} style={styles.iconBtn}>
            <Ionicons name="person-add" size={22} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersRow}>
        {item.members && item.members.map((member, idx) => renderMember(member, idx, item.id))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { marginTop: 40 }]}>Takımlar</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1A73E8" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.Id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Henüz takım yok.</Text>}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTeam')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Üye Ekle</Text>
            <Text style={{ marginBottom: 4 }}>Kullanıcı:</Text>
            <Picker
              selectedValue={selectedUserId}
              onValueChange={(itemValue) => setSelectedUserId(itemValue)}
              style={{ marginBottom: 12 }}
            >
              <Picker.Item label="Seçiniz" value="" />
              {users.map((u) => (
                <Picker.Item key={u.id} label={`${u.name} ${u.surname}`} value={u.id} />
              ))}
            </Picker>
            <Text style={{ marginBottom: 4 }}>Rol:</Text>
            <Picker
              selectedValue={selectedTitle}
              onValueChange={(itemValue) => setSelectedTitle(itemValue)}
              style={{ marginBottom: 12 }}
            >
              {Object.entries(titleMap).map(([key, val]) => (
                <Picker.Item key={key} label={val.label} value={parseInt(key)} />
              ))}
            </Picker>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.iconBtn, { backgroundColor: '#eee', marginRight: 8 }]}> 
                <Text>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddMemberModal} style={[styles.iconBtn, { backgroundColor: '#1A73E8' }]} disabled={adding}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{adding ? 'Ekleniyor...' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
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
  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  teamName: { fontSize: 18, fontWeight: 'bold', color: '#1A73E8', marginBottom: 4 },
  teamDesc: { fontSize: 15, color: '#444', marginBottom: 8 },
  membersRow: { flexDirection: 'row', marginTop: 8 },
  memberCard: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 60,
    overflow: 'visible',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  memberName: { fontSize: 11, fontWeight: 'bold', color: '#222', textAlign: 'center' },
  roleTag: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  roleText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
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
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  iconBtn: { marginLeft: 8, padding: 4, borderRadius: 16 },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: 320,
    elevation: 5,
  },
});

export default TeamsScreen; 