import React, { useState } from 'react';
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

const CreateTeam = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (key, value) => {
    setTeamData(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    if (!teamData.name || teamData.name.length < 2 || teamData.name.length > 100) {
      Alert.alert('Uyarı', 'Takım adı 2-100 karakter arasında olmalıdır.');
      return;
    }
    if (teamData.description.length > 500) {
      Alert.alert('Uyarı', 'Açıklama en fazla 500 karakter olabilir.');
      return;
    }
    try {
      setIsLoading(true);
      await ApiClient.post('/teams', {
        name: teamData.name,
        description: teamData.description,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Team creation error:', error);
      Alert.alert('Hata', 'Takım oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Yeni Takım Oluştur</Text>

        <TextInput
          style={styles.input}
          placeholder="Takım Adı"
          value={teamData.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <Text style={styles.helperText}>2-100 karakter</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Açıklama"
          value={teamData.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.helperText}>En fazla 500 karakter</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Oluştur</Text>
            )}
          </TouchableOpacity>
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
    marginBottom: 6,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#1A73E8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 100,
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

export default CreateTeam; 