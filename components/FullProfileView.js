import React from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, StatusBar, ImageBackground} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');


const FullProfileView = ({ hideFullImage, profileImage }) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={hideFullImage}
    >
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f0f0f0'}/>
      
      <View style={styles.container}>
       <ImageBackground source={require('../assets/graduate.png')} style={styles.background}>
        <TouchableOpacity style={styles.overlay} onPress={hideFullImage} activeOpacity={0.2}/>
         <View style={styles.content}>
          <TouchableOpacity onPress={hideFullImage} style={styles.back}>
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>

          <View style={styles.fullbody}>
            <Image style={styles.fullImage} source={profileImage} />
          </View>
        </View>
        </ImageBackground>
        
      </View>
 
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0', 
  },
  content: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: width * 0.1, paddingVertical: height * 0.3,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 5,
  },
  fullbody: {
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 10, borderColor: 'white',
  },

});

export default FullProfileView;
