import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tickets = () => {
  // Örnek bilet verileri
  const tickets = [
    { 
      id: '1', 
      title: 'API Integration Issue', 
      priority: 'High',
      status: 'Open',
      project: 'Taskly Mobile App'
    },
    { 
      id: '2', 
      title: 'UI Design Updates', 
      priority: 'Medium',
      status: 'In Progress',
      project: 'E-Commerce Website'
    },
    { 
      id: '3', 
      title: 'Database Optimization', 
      priority: 'Low',
      status: 'Closed',
      project: 'CRM System'
    },
  ];

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      
      <View style={styles.ticketDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="folder-outline" size={20} color="#666" />
          <Text style={styles.detailText}>{item.project}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="radio-button-on" size={20} color="#666" />
          <Text style={styles.detailText}>Status: {item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>New Ticket</Text>
      </TouchableOpacity>
      
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A73E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
});

export default Tickets; 