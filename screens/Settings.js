import React, { useState, useEffect,useCallback} from 'react';
import { View,Alert, Text, Modal, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, TextInput, VirtualizedList, StatusBar} from 'react-native';
import { FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import { logout } from "../src/store/store";
import { useSelector, useDispatch } from 'react-redux';
import CampusModal from './CampusProfile';
import { useNavigation } from "@react-navigation/native";



const Settings = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert('Logout','Are you sure you want to log out?',
      [{text: 'Cancel',style: 'cancel',},
        {text: 'OK',
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'StartPage' }],
            })}}])};
  
  
  const showModal = () => { setModalVisible(true);
    Animated.timing(slideAnim, {toValue: 0, duration: 100, useNativeDriver: true, }).start();};
  const hideModal = () => { Animated.timing(slideAnim, { toValue: width, duration: 100, useNativeDriver: true,
    }).start(() => setModalVisible(false));};


    // Functions start here
    

  return (
    <View>
        <TouchableOpacity onPress={showModal} style={styles.button}>
           <MaterialIcons name="menu" size={25} color="#404040" />
         </TouchableOpacity>

      <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={hideModal}  > 
         <Animated.View style={[styles.modal,{ transform: [{ translateX: slideAnim }] },]}>

         <View style={styles.header}>   
             <TouchableOpacity onPress={hideModal}  style={styles.back}>
                 <MaterialIcons name="arrow-back" size={25} color="#000" />
              </TouchableOpacity>
              <Text style={styles.sett}>Settings</Text>
           </View>

      {/* Body */}
       <View style={styles.body}>
         
           <TouchableOpacity style={styles.snippets}>
           <CampusModal/>
           </TouchableOpacity>
           <TouchableOpacity style={styles.snippets}>
              <Text style={styles.snippetText}>Menu</Text>
           </TouchableOpacity>
            <TouchableOpacity style={styles.snippets} onPress={handleLogout}>
              <Text style={styles.snippetText}>Edit Profile</Text>
            </TouchableOpacity>
           <TouchableOpacity style={styles.snippets} onPress={handleLogout}>
              <Text style={styles.snippetText}>Log out</Text>
           </TouchableOpacity>

          

        </View>

    </Animated.View>
    </Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    left:0, top: 0, bottom: 0, flex: 1,
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
     fontSize: 18, marginLeft: 25, top: 15,
     fontWeight: '500'
  },
body:{
    position: 'absolute',
    top: 62, 
    left:0, right: 0,bottom: 0,
    backgroundColor: 'white'
  },
  snippets:{
    padding: 20,
  },
  snippetText:{
    fontSize: 15,
  },
  button:{
    backgroundColor: 'white',
     elevation: 2,
    borderRadius: 100, padding: 2
  }
 
});

export default Settings;
