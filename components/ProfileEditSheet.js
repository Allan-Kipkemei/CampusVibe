import React, { useState, useEffect} from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Dimensions,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


const ProfileEditSheet = ({newProfileImage, profileImageUrl, defaultProfileImage, selectImage, removeImage,captureImage, modalVisible, setModalVisible}) => {
    const navigation = useNavigation()
    const { width } = Dimensions.get('window');
    const slideAnim = React.useRef(new Animated.Value(width)).current;
  
    const showModal = () => {setModalVisible(true);
      Animated.timing(slideAnim, {toValue: 0,duration: 100,useNativeDriver: true,}).start();
    };
    
    const { height } = Dimensions.get('window');
    const hideModal = () => {Animated.timing(slideAnim, 
        {toValue: height,duration: 100,useNativeDriver: true,}).start(() => setModalVisible(false));
    };
    
    

  
    return (
      <View>
      <TouchableOpacity style={styles.profileImageContainer} onPress={showModal}>
           <Image source={newProfileImage ? {uri: newProfileImage} : profileImageUrl ? {uri: profileImageUrl} : defaultProfileImage} style={styles.profileImage}/>
        <MaterialCommunityIcons
           name="camera-plus"
            size={32}
            color="white"
           style={styles.cameraIcon}
          />
      </TouchableOpacity>

        <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={hideModal}> 
        <Animated.View style={[ styles.modal, { transform: [{ translateY: slideAnim }] },]}>
        
            {/* Body */}
            <View style={styles.body}>
              <TouchableOpacity style={styles.button} onPress={hideModal}>
                 <MaterialIcons name="cancel" size={30} color="#707070" />
                 <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={captureImage}>
                  <MaterialIcons name="photo-camera" size={30} color="#2696b8" />
                  <Text style={styles.buttonText}>Take Photo</Text>   
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={selectImage}>
                 <MaterialIcons name="camera" size={30} color="orange" />
                 <Text style={styles.buttonText}>Gallery</Text>   
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={removeImage}>
                 <Image source={defaultProfileImage} style={styles.image}/>
                 <Text style={styles.buttonText}>Remove</Text>   
              </TouchableOpacity>
            </View>
  
          </Animated.View>
        </Modal>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  modal: {
    left:0, bottom: 0, flex: 1, 
    alignSelf: 'center', alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    padding: 20,
    position: 'absolute',
    right:0,
  },
  header:{
    position: 'absolute', top: 0,
    left: 0, right: 0,
    backgroundColor: 'white',
    height: 60, flexDirection: 'row',
   
  },
  back: {
    left: 15, top: 15,
  },
  sett:{
     fontSize: 18, marginLeft: 25, top: 18,
     fontWeight: '500'
  },
body:{
    position: 'absolute', 
    left:0, right: 0,bottom: 0,
    backgroundColor: 'white',
    borderTopRightRadius: 20, borderTopLeftRadius: 20,
    flexDirection: 'row',
    justifyContent:'space-between', paddingHorizontal: 10

  },
  profileImageContainer: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 20,
    },
    profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100, 
    },
    cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: '#2C96B8',
    borderRadius: 20,
    padding: 5,
    },
    button:{
      padding: 20,
      alignItems: 'center'
    },
    image: {
      width: 34, height: 34,
      borderWidth: 1, borderColor: '#707070', borderRadius: 100
    }
 
 
});

export default ProfileEditSheet;
