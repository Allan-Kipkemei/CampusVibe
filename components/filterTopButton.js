import React, { useState, useEffect} from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, Button} from 'react-native';
import { color } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

const CampusModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };
 const all = 'All';
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);

  useEffect(() => {
    dispatch({ type: 'SET_FILTER', payload: { filter: 'all' } });
  }, []);
  const handleMenuPress = (selectedFilter) => {
    dispatch({ type: 'SET_FILTER', payload: { filter: selectedFilter } });
  };


  const campus = useSelector((state) => state.campus.id);
  const faculty = useSelector((state) => state.campus.faculty);
  const active = useSelector((state) => state.filter.filter);
 
  return (
    <View>
      <TouchableOpacity onPress={showModal} style={styles.button}>
        <Image 
          source={require('../assets/feed4.png')}
          style={styles.icon}
        />
       
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
      
          <Animated.View
            style={[
              styles.modal,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >  
             
       <View style={styles.title}>
         <Text style={styles.active}>Showing: {active}</Text>
        </View>
       <View style={styles.menu}>
             <TouchableOpacity onPress={() => handleMenuPress('all')}>
               <Text style={[styles.menunormal, filter === {all} && styles.menuactive]}>{all}</Text>
             </TouchableOpacity>
        </View>
        <View style={styles.menu}>
             <TouchableOpacity onPress={() => handleMenuPress(campus)}>
                <Text style={[styles.menunormal, filter === campus && styles.menuactive]}>{campus}</Text>
             </TouchableOpacity>
        </View>
        <View style={styles.menu}>
             <TouchableOpacity onPress={() => handleMenuPress(faculty)}>
               <Text style={[styles.menunormal, filter === faculty && styles.menuactive]}>{faculty}</Text>
             </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={hideModal} style={{padding: 10, backgroundColor:'#2696b8',
         position:'absolute', bottom: 100, alignSelf:'center', borderRadius: 15
         }}>
        <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>

          </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  icon:{
    width: 20, height: 20,
  }, 
  button:{

  },
  active:{
    padding: 5, color: '#2696b8', fontWeight: '500',
    
  },
  backdrop: {
  
  },
  modal: {
    left:150, top: 60, bottom: 60,
    alignSelf: 'center', alignItems: 'flex-end',
    backgroundColor: '#ffff',
    padding: 20,
    position: 'absolute', right:0,
  },
  title:{
    width: '90%',
 
  },
  modalTitle:{
    fontWeight: '600', fontSize: 17, padding: 10, paddingTop: 1,
  },
  menu:{
    alignSelf:'flex-end', width: '90%',
 paddingBottom: 20,
 borderBottomWidth: 1, borderBottomColor: '#c0c0c0' 
  }, 
  menuactive:{
    fontWeight: '500', alignSelf: 'flex-end', color: '#2969b8',
  },
  menunormal:{
    alignSelf: 'flex-end', fontWeight: '500', padding: 5,
  },
 
});

export default CampusModal;
