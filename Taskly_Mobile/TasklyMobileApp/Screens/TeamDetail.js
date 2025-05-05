import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetTeamByIdQuery } from '../Apis/TeamApi';
import { useNavigation } from '@react-navigation/native';

const TeamDetail = ({ route }) => {
  const { teamId } = route.params;
  const navigation = useNavigation();
  
  const { data: team, isLoading } = useGetTeamByIdQuery(teamId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Text>Takım bulunamadı.</Text>
      </View>
    );
  }

  const renderMember = ({ item }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Ionicons name="person-circle-outline" size={40} color="#1A73E8" />
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberRole}>{item.role}</Text>
        </View>
      </View>
      <View style={styles.memberStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.taskCount}</Text>
          <Text style={styles.statLabel}>Görev</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.projectCount}</Text>
          <Text style={styles.statLabel}>Proje</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.teamName}>{team.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('TeamEdit', { teamId })}
          >
            <Ionicons name="create-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
        </View>
        <Text style={styles.teamDescription}>{team.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Takım İstatistikleri</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{team.memberCount}</Text>
            <Text style={styles.statLabel}>Üye</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{team.projectCount}</Text>
            <Text style={styles.statLabel}>Proje</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{team.taskCount}</Text>
            <Text style={styles.statLabel}>Görev</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{team.completionRate}%</Text>
            <Text style={styles.statLabel}>Tamamlanma</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Takım Üyeleri</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTeamMember', { teamId })}
          >
            <Ionicons name="add" size={20} color="#1A73E8" />
            <Text style={styles.addButtonText}>Üye Ekle</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={team.members}
          renderItem={renderMember}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.membersList}
        />
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
  teamName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  teamDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '500',
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
  membersList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
});

export default TeamDetail; 