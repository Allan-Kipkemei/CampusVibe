import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import { collection, doc, updateDoc, Timestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import {db} from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';

const CampusModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const campus = useSelector((state) => state.campus);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleImageUpdate = async () => {
    const campusRef = doc(db, 'campus', campus.id);
    try {
      await updateDoc(campusRef, { profile: image, updatedAt: Timestamp.now() });
      alert('Profile image updated successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      alert('Error updating profile image.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="upload" color="#c0c0c0" size={14} />
      </TouchableOpacity>
      <Modal animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            ) : (
              <Text style={styles.text}>Select a profile image</Text>
            )}
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={handleImageUpdate} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 16,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
});

export default CampusModal;
