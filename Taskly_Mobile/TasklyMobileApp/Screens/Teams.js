import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetTeamsQuery, useDeleteTeamMutation } from '../Apis/TeamApi';

const Teams = () => {
  const navigation = useNavigation();
  const { data: teams, isLoading, error } = useGetTeamsQuery();
  const [deleteTeam] = useDeleteTeamMutation();

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId).unwrap();
      Alert.alert('Başarılı', 'Takım başarıyla silindi.');
    } catch (error) {
      Alert.alert('Hata', 'Takım silinirken bir hata oluştu.');
      console.error('Delete Team Error:', error);
    }
  };

  const confirmDelete = (teamId) => {
    Alert.alert(
      'Takımı Sil',
      'Bu takımı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', onPress: () => handleDeleteTeam(teamId), style: 'destructive' },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Bir hata oluştu!</Text>
        <Text style={styles.errorDetail}>
          {error.status === 'FETCH_ERROR' 
            ? 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.'
            : error.data?.message || 'Beklenmeyen bir hata oluştu.'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace('Teams')}
        >
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTeamItem = ({ item }) => (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
    >
      <View style={styles.teamHeader}>
        <Text style={styles.teamName}>{item.name}</Text>
        <View style={styles.memberCount}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.memberCountText}>{item.memberCount || 0}</Text>
        </View>
      </View>
      <Text style={styles.teamDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.teamStats}>
        <View style={styles.statItem}>
          <Ionicons name="folder-outline" size={16} color="#666" />
          <Text style={styles.statText}>{item.projectCount || 0} Proje</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkbox-outline" size={16} color="#666" />
          <Text style={styles.statText}>{item.taskCount || 0} Görev</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={teams}
        renderItem={renderTeamItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz hiç takım oluşturulmamış.</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTeam')}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  teamCard: {
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
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A73E8',
    flex: 1,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  memberCountText: {
    fontSize: 12,
    color: '#1A73E8',
  },
  teamDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  teamStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
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
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1A73E8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Teams; 