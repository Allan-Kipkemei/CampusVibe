import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MyCourse = ({ field}) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
   const [modalVisible, setModalVisible] = useState(false)
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
      <TouchableOpacity onPress={()=> setModalVisible(true)} style={styles.course}>
        <Text style={styles.field}>
        {field.length > 10 ? `${field.substring(0, 20)}...` : field}
        </Text>
      </TouchableOpacity>
       <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={hideModal}> 
          <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>

          <View style={styles.header}>   
             <TouchableOpacity onPress={hideModal}  style={styles.back}>
                 <MaterialIcons name="arrow-back" size={25} color="#000" />
              </TouchableOpacity>
              <Text style={styles.sett}>{field}</Text>
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
    course:{
    paddingVertical: 10, paddingHorizontal: 10,
    backgroundColor: '#f6f6f6', 
    // borderWidth: 1, borderColor: '#c0c0c0',
    borderRadius: 10, alignItems: 'center'
  },
});

export default MyCourse;


