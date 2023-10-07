import { View, Image, StyleSheet, Modal, StatusBar, TouchableOpacity} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { SET_CAMPUS_FILTER } from '../src/store/store';
import { useEffect, React , useState} from "react";
import CampusModal from "./filterTopButton";
import Settings from "../screens/Settings";
import { Ionicons } from '@expo/vector-icons';
import NotificationsPage from "../screens/notifications";

const Topnav = ({screen}) => {
  const campus = useSelector(state => state.campus);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View style={styles.header}>
         <Image style={styles.top} source={require('../assets/camp.png')}/>
      </View>
  
      <View style={styles.right}>
         {screen === 'feed' &&(
          <View style={styles.feed}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
               <Ionicons name="ios-notifications-outline" size={24} color="black" />
             </TouchableOpacity>
             {modalVisible && (
               <NotificationsPage modalVisible={modalVisible} setModalVisible={setModalVisible}/>
             )}
           <CampusModal />
         </View>
         )}
         {screen === 'account' && (<Settings/>)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingRight: 20,
    height: 60,
  },
  headertext:{
    fontSize: 22, fontWeight: '500'
  },
  top:{
    width: 120, borderWidth: 1,
    height: 70
  },
  header:{
    // borderWidth: 1
  },
  feed:{
    flexDirection:'row',
    alignItems: 'center',
    // borderWidth:1, 
    width: 70, justifyContent: 'space-between',
    marginHorizontal:10
  }
 
});

export default Topnav;
