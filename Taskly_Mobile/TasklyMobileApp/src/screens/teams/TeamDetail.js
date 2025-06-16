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

const TeamDetail = ({ route, navigation }) => {
  const { teamId } = route.params;
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.get(`/teams/${teamId}`);
      setTeam(response);
    } catch (error) {
      console.error('Team detail fetch error:', error);
      Alert.alert('Hata', 'Takım detayları yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Takımı Sil',
      'Bu takımı silmek istediğinizden emin misiniz?',
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
              await ApiClient.delete(`/teams/${teamId}`);
              navigation.goBack();
            } catch (error) {
              console.error('Team delete error:', error);
              Alert.alert('Hata', 'Takım silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

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
        <Text style={styles.errorText}>Takım bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{team.name}</Text>
          <Text style={styles.type}>{team.type}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('TeamEdit', { teamId })}
          >
            <Ionicons name="create-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{team.description}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Takım Üyeleri</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTeamMember', { teamId })}
          >
            <Ionicons name="add-circle-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
        </View>
        <View style={styles.membersList}>
          {team.members.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projeler</Text>
        <View style={styles.projectsList}>
          {team.projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectItem}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
            >
              <View style={styles.projectInfo}>
                <Text style={styles.projectTitle}>{project.name}</Text>
                <Text style={styles.projectStatus}>{project.status}</Text>
              </View>
              <Text style={styles.projectDescription} numberOfLines={2}>
                {project.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  type: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A73E8',
  },
  addButton: {
    padding: 4,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
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
  projectsList: {
    marginTop: 8,
  },
  projectItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A73E8',
  },
  projectStatus: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default TeamDetail; 