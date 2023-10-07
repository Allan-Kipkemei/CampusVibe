import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const NotificationsPage = ({ modalVisible, setModalVisible }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: width, duration: 100, useNativeDriver: true }).start();
    }
  }, [modalVisible]);

  const hideModal = () =>{
    setModalVisible(false)
  }
  return (
    <View>
       <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={hideModal}> 
          <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>

          <View style={styles.header}>   
             <TouchableOpacity onPress={hideModal}  style={styles.back}>
                 <MaterialIcons name="arrow-back" size={25} color="#000" />
              </TouchableOpacity>
              <Text style={styles.sett}>Notifications</Text>
           </View>
            {/* Body */}
            <View style={styles.body}>
  
            </View>
  
          </Animated.View>
        </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    height: height, width: width
  },
  header:{
    flexDirection: 'row', 
    padding:10, alignItems: 'center'
  },
  back: {
    marginHorizontal:5
  },
  sett:{
     fontSize: 18,
     fontWeight: '600',
     marginHorizontal:5
  },
body:{
    position: 'absolute',
    top: 62, 
    left:0, right: 0,bottom: 0,
    backgroundColor: 'white'
  },
});

export default NotificationsPage;


