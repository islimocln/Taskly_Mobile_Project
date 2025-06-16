import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import ApiClient from '../../api/apiClient';

const TeamEdit = ({ route, navigation }) => {
  const { teamId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    type: '',
  });

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.get(`/teams/${teamId}`);
      setTeamData({
        name: response.name,
        description: response.description,
        type: response.type,
      });
    } catch (error) {
      console.error('Team fetch error:', error);
      Alert.alert('Hata', 'Takım detayları yüklenirken bir hata oluştu.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setTeamData(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (!teamData.name || !teamData.description || !teamData.type) {
        Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
        return;
      }

      setIsLoading(true);
      await ApiClient.put(`/teams/${teamId}`, teamData);
      navigation.goBack();
    } catch (error) {
      console.error('Team update error:', error);
      Alert.alert('Hata', 'Takım güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Takımı Düzenle</Text>

        <TextInput
          style={styles.input}
          placeholder="Takım Adı"
          value={teamData.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Takım Açıklaması"
          value={teamData.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Takım Tipi"
          value={teamData.type}
          onChangeText={(text) => handleChange('type', text)}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Güncelle</Text>
          )}
        </TouchableOpacity>
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
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1A73E8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeamEdit; 