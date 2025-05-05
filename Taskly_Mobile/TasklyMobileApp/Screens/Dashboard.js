import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const quickStats = [
    { icon: 'folder-outline', label: 'Aktif Projeler', value: '5' },
    { icon: 'checkbox-outline', label: 'Açık Görevler', value: '8' },
    { icon: 'time-outline', label: 'Bugün Son Tarihli', value: '3' },
  ];

  const recentProjects = [
    { id: '1', name: 'Taskly Mobile App', progress: 75 },
    { id: '2', name: 'E-Commerce Website', progress: 45 },
    { id: '3', name: 'CRM System', progress: 90 },
  ];

  const renderProgressBar = (progress) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hoşgeldin Mesajı */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Hoş geldin, {user?.name || 'Kullanıcı'}!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>

      {/* Hızlı İstatistikler */}
      <View style={styles.statsContainer}>
        {quickStats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Ionicons name={stat.icon} size={24} color="#1A73E8" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Son Projeler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Projeler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {recentProjects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.projectCard}
            onPress={() => navigation.navigate('ProjectDetail', { id: project.id })}
          >
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.progressText}>{project.progress}%</Text>
            </View>
            {renderProgressBar(project.progress)}
          </TouchableOpacity>
        ))}
      </View>

      {/* Hızlı Eylemler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı Eylemler</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CreateProject')}>
            <Ionicons name="add-circle-outline" size={24} color="#1A73E8" />
            <Text style={styles.actionText}>Yeni Proje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CreateTask')}>
            <Ionicons name="create-outline" size={24} color="#1A73E8" />
            <Text style={styles.actionText}>Yeni Görev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CreateDocument')}>
            <Ionicons name="cloud-upload-outline" size={24} color="#1A73E8" />
            <Text style={styles.actionText}>Döküman Yükle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CreateTeam')}>
            <Ionicons name="people-outline" size={24} color="#1A73E8" />
            <Text style={styles.actionText}>Takım Oluştur</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#1A73E8',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#1A73E8',
    fontSize: 14,
  },
  projectCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1A73E8',
    borderRadius: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionCard: {
    width: '48%',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default Dashboard;
