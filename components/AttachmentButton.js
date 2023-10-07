import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, MaterialIcons, Entypo } from '@expo/vector-icons';


const AttachmentButton = (props) => {
  const selectImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    

    if (!result.cancelled) {
      props.onImageCapture(result.uri);
    }
  };


  const selectPoll = () => {
    // Implement functionality for poll attachment
  };
  const selectVideo = () =>{
    // Implement functionality for video/media attachment
  }

  return (
    <View style={styles.body}>
      <View style={styles.attachmentContainer}>
        <TouchableOpacity onPress={selectImage} style={styles.button}>
           <MaterialCommunityIcons name="image-plus" size={20} color="#2696b8" />    
          </TouchableOpacity>
        <TouchableOpacity onPress={selectPoll} style={styles.button}>
           <MaterialCommunityIcons name="poll" size={20} color="#2696b8" />
         </TouchableOpacity>
         <TouchableOpacity onPress={selectVideo} style={styles.button}>
           <MaterialIcons name="video-library" size={20} color="#2696b8" />
         </TouchableOpacity>
         <TouchableOpacity onPress={selectVideo} style={styles.button}>
           <Entypo name="location" size={20} color="#2696b8" />
         </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  attachmentContainer: {
    flexDirection: 'row',
    left: 10, alignItems: 'center',
  },
  body:{
 
  },
  button:{
    marginHorizontal:10,
    backgroundColor:'#fff',
    borderRadius:100, padding: 10,
    elevation:2
  }
});

export default AttachmentButton;
