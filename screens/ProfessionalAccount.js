import React, { useState, useEffect} from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Dimensions,} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import StudentNotProfessional from '../components/StudentNotProfessional';
import StudentProfessional from '../components/StudentProfessional';
import CreateProfessionalAccount from './CreateProfessionalAccount';
import { useSelector } from 'react-redux';
import { db } from '../firebase/firebase';
import { collection, query, where,doc, getDocs} from 'firebase/firestore';
import ProfessionalBusiness from '../components/ProfessionalBusiness';
import ProfessionalPortfolio from './ProfessionalPortfolio';
import ProfessionalFreemium from './ProfessionalFreemium';
import { useNavigation } from '@react-navigation/native';


const Professional = () => {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false);
    const [activeComponent, setActiveComponent] = useState('slides');
    const { width } = Dimensions.get('window');
    const slideAnim = React.useRef(new Animated.Value(width)).current;
  
    const showModal = () => { setModalVisible(true);
      Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start();
    };
    const hideModal = () => { Animated.timing(slideAnim, { toValue: width, duration: 100, useNativeDriver: true }).start(() => setModalVisible(false));
    };
    const handleCreateProfessionalAccount = () => {setActiveComponent('createProfessionalAccount');};


    const handleBackToSlides = () => {
      setActiveComponent('slides');
    };
  // start functions
  const userId = useSelector((state => state.userProfile.userId))
  const [isProfessional, setIsProfessional] = useState(false);
  const [subscription, setSubscription] = useState([]);



  if(userId){
    useEffect(() => {
      const fetchSubscription = async () => {
        const professionalRef = collection(db, "userProfiles", userId, "professional");
        const professionalSnapshot = await getDocs(professionalRef);
        
        setIsProfessional(!professionalSnapshot.empty);
    
        if (!professionalSnapshot.empty) {
          const subscriptionData = professionalSnapshot.docs.map((doc) => doc.data());
          setSubscription(subscriptionData);
        }
      };
    
      fetchSubscription();
    }, [userId]);
    
    
}else{
  navigation.navigate('BottomTabsRoot', { screen: 'AuthPage' });
}
   
    return (
      <View>
         <TouchableOpacity onPress={showModal} style={styles.button}>
           <Text style={styles.buttonText}>
             {isProfessional ? 'Professional Dashboard' : 'Switch to Professional'}
            </Text>
         </TouchableOpacity>

        <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={hideModal}> 
          <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>
  
            <View style={styles.header}>   
              {activeComponent === 'slides' ? (
                <TouchableOpacity onPress={hideModal} style={styles.back}>
                  <MaterialIcons name="arrow-back" size={25} color="#000" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleBackToSlides} style={styles.back}>
                  <MaterialIcons name="arrow-back" size={25} color="#000" />
                </TouchableOpacity>
              )}
              <Text style={styles.sett}>Professional Student</Text>
            </View>
  
            {/* Body */}
            <View style={styles.body}>
  {isProfessional ? (
   subscription.map((doc) => {
    if (doc.type === 'business') {
      return <ProfessionalBusiness key={doc.id} subscription={doc} />;
    } else if (doc.type === 'portfolio') {
      return <ProfessionalPortfolio key={doc.id} package={doc} />;
    } else {
      return <ProfessionalFreemium key={doc.id} package={doc} />;
    }
  })
  
  ) : (
    activeComponent === 'slides' ? (
      <StudentNotProfessional onCreateProfessionalAccount={handleCreateProfessionalAccount} />
    ) : (
      <CreateProfessionalAccount />
    )
  )}
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
     fontSize: 18, marginLeft: 25, top: 18,
     fontWeight: '500'
  },
body:{
    position: 'absolute',
    top: 62, 
    left:0, right: 0,bottom: 0,
    backgroundColor: 'white'
  },
  button:{
    paddingVertical: 10, paddingHorizontal: 10,
    backgroundColor: '#f6f6f6', 
    // borderWidth: 1, borderColor: '#c0c0c0',
    borderRadius: 10, alignItems: 'center'
  },
  buttonText:{
    
  }
 
});

export default Professional;
