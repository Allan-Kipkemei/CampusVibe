import React, { useState, useEffect,useCallback, useRef} from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, StatusBar} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import PostTab from '../components/LikeTab';

const ImageView = ({ image, topic,topicTag, message, postId}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const { width, height } = Dimensions.get('window');
    const slideAnim = useRef(new Animated.Value(width)).current;
  
    const showModal = () => {
      setModalVisible(true);
      Animated.timing(slideAnim, {toValue: 0,duration: 100,useNativeDriver: true,}).start();
    };
  
    const hideModal = () => {
      Animated.timing(slideAnim, 
        {toValue: width, duration: 100,useNativeDriver: true,}).start(() => setModalVisible(false));
    };

      
    return (
      <View>
        <StatusBar hidden={false}/>
        <TouchableOpacity onPress={showModal} activeOpacity={0.8}>
          <Image style={styles.photo} source={{ uri: image }} />
        </TouchableOpacity>
        <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={hideModal}>
          <Animated.View style={[styles.modal,{ transform: [{ translateX: slideAnim }] }, ]} >
            <View style={styles.header}>
                 <TouchableOpacity onPress={hideModal} style={styles.back}>
                     <MaterialIcons name="arrow-back" size={25} color="white" />
                  </TouchableOpacity>
                  {/* <Text style={styles.topic}>
                     <FontAwesome5 name={topicTag} size={20} color="orange" /> 
                     {trimTopic(topic)}
                 </Text> */}
            </View>
             
            <View style={styles.body}>
               
              <Image
                resizeMode="contain"
                style={styles.fullscreenImage}
                source={{ uri: image }}
              />
                
             </View>
             <View style={styles.likes}>
             <Text style={styles.message}>{message}</Text>
                <PostTab postId={postId}/>
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
    padding: 20,
    position: 'absolute',
     right:0,
  },
  body:{
    position: 'absolute',
    top: 0, 
    left:0, right: 0,bottom: 0,
    backgroundColor: 'black'

  },
  photo:{
    width: '100%', height:250,
    borderRadius:15, borderWidth: 1, borderColor: '#f0f0f0',
    alignSelf: 'center'
  },
  fullscreenImage:{
    width: "100%", height: "100%",
    bottom: 50, top: 0
  },
back:{
     
}, 
topic:{
     marginLeft: 10, fontWeight: '600', fontSize: 18,
     color:'white'
},
header:{
    position:'absolute', left:0, top: 0, zIndex: 2,
    flexDirection: 'row',
    // backgroundColor: 'rgb(0,0,0)',
    padding: 20,right: 0

},
message:{
    color: 'white', 
    
}, 
likes:{
  backgroundColor: 'rgba(0,0,0, 0.5)',
    position: 'absolute',
    bottom:0,
    left: 0, right: 0, paddingHorizontal: 20,
    paddingBottom: 20
   
}

 
});

export default ImageView;
