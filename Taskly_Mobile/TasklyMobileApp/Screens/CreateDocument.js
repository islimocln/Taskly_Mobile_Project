import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCreateDocumentMutation } from '../Apis/DocumentApi';
import { useNavigation } from '@react-navigation/native';

const CreateDocument = () => {
  const navigation = useNavigation();
  const [createDocument, { isLoading }] = useCreateDocumentMutation();
  
  const [documentData, setDocumentData] = useState({
    title: '',
    description: '',
    type: 'pdf',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (field, value) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
        setPreview(result.assets[0].uri);
        
        // Dosya tipini belirle
        const fileType = result.assets[0].uri.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
          handleChange('type', 'image');
        } else if (['xlsx', 'xls', 'csv'].includes(fileType)) {
          handleChange('type', 'spreadsheet');
        } else {
          handleChange('type', 'pdf');
        }
      }
    } catch (error) {
      Alert.alert('Hata', 'Dosya seçilirken bir hata oluştu');
    }
  };

  const handleSubmit = async () => {
    if (!documentData.title.trim()) {
      Alert.alert('Hata', 'Döküman başlığı boş olamaz');
      return;
    }

    if (!file) {
      Alert.alert('Hata', 'Lütfen bir dosya seçin');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', documentData.title);
      formData.append('description', documentData.description);
      formData.append('type', documentData.type);
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType,
        name: file.fileName || 'document',
      });

      await createDocument(formData).unwrap();
      
      Alert.alert('Başarılı', 'Döküman başarıyla yüklendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Döküman yüklenirken bir hata oluştu');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Döküman</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Başlık</Text>
          <TextInput
            style={styles.input}
            value={documentData.title}
            onChangeText={value => handleChange('title', value)}
            placeholder="Döküman başlığını girin"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={documentData.description}
            onChangeText={value => handleChange('description', value)}
            placeholder="Döküman açıklamasını girin"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosya</Text>
          <TouchableOpacity
            style={styles.filePicker}
            onPress={pickFile}
          >
            {preview ? (
              <Image
                source={{ uri: preview }}
                style={styles.preview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.filePickerContent}>
                <Ionicons name="cloud-upload-outline" size={40} color="#1A73E8" />
                <Text style={styles.filePickerText}>Dosya Seç</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Yükle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  filePicker: {
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  filePickerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filePickerText: {
    marginTop: 8,
    fontSize: 16,
    color: '#1A73E8',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateDocument; 