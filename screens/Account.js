import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList, StatusBar} from "react-native";
import Topnav from "../components/Topnav";
import { useSelector, useDispatch } from 'react-redux';
import Courses from "../components/courses";
import { LinearGradient } from 'expo-linear-gradient';
import {db} from '../firebase/firebase';
import { collection, onSnapshot, doc, getDoc , collectionGroup} from "firebase/firestore";
import { FontAwesome5 } from '@expo/vector-icons';
import Settings from "./Settings";
import AccountTabs from "./AccountTabs";
import Professional from "./ProfessionalAccount";
import { useNavigation } from "@react-navigation/native";
import MyCourse from "../components/MyCourse";
import FFModal from "./FFView";
import NetworkError from "../components/NetworkError";


const { width, height } = Dimensions.get('window');


const Account = () => {
  const navigation = useNavigation();
  // Default user details
  const defaultProfileImage = require("../assets/graduate.png");
  const defaultUsername = "Student";
  const defaultField = "Guest";
  const defaultCampusProfile = require('../assets/campus.jpg')
  // Fetch details
  const userProfile = useSelector((state) => state.userProfile);
  const userId = userProfile.userId;
  const campus = useSelector(state => state.campus);
  if(!userId || !campus || !userProfile){
    navigation.navigate('BottomTabsRoot', {screen: 'Authpage'})
  }
  const courseCode = `${campus.faculty}${campus.course}`
  const courseName = Courses[courseCode.toUpperCase()];
  const [campusProfile, setCampusProfile] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);
  const [profileUpdate, setUpdateMessage] = useState(null);
  const [errorMessage, setErrorMesage] = useState(null)
console.log(errorMessage)

  if (userProfile.userId) {
    try{
    useEffect(() => {
      const unsubscribeFollowers = onSnapshot(
        collection(db, "userProfiles", userProfile.userId, "followers"),
        (snap) => setFollowersCount(snap.size)
      );
      const unsubscribeFollowing = onSnapshot(
        collection(db, "userProfiles", userProfile.userId, "following"),
        (snap) => setFollowingCount(snap.size)
      );
  
      return () => {
        unsubscribeFollowers();
        unsubscribeFollowing();
      };
    }, [userProfile.userId]);
  }catch(error){
    const errorMesage = 'No internet connection'
    setErrorMesage(errorMesage)
  }
  }else{
    navigation.navigate('StartPage')
  }
  

  //Set details
  const [username, setUsername] = useState(defaultUsername);
  const [field, setField] = useState(defaultField);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [about, setAbout] = useState(userProfile.about)
  

  // Set year and Student account type
  const currentYear = new Date().getFullYear();
  const startYear = campus.yearOfAdmission;

  const endYear = Number(startYear) + 4;
  let joined = "";
  if (userProfile.userType === "Student") {
    joined = `Joined: ${startYear} - ${endYear}`;
  } else if (campus.field === "Service") {
    joined = `Joined: ${startYear} to date`;
  }
  const userStatus = currentYear >= endYear ? "Alumni" : "Active";

  useEffect(() => {
    setUsername(userProfile.username || defaultUsername);
    setField(courseName);
    const profileImage = userProfile.profileImage;
    setProfileImage(
     typeof profileImage === 'string' ? {uri : profileImage} : defaultProfileImage
 );
  }, [userProfile]);
 
  const [activeTab, setActiveTab] = useState('')
  const [showModal, setShowModal] = useState('');
  const handleTabPress = (tabKey) => {
     setActiveTab(tabKey)
     setShowModal(true)
    };
  const hideModal = () =>{
    setActiveTab('n')
    setShowModal('')
  }

  return (
    <FlatList
    contentContainerStyle={styles.container}
    data={[{ key: 'Account' }]}
    showsVerticalScrollIndicator={false}
    renderItem={() => (
    <View style={styles.container}>
          <StatusBar backgroundColor={'white'} barStyle={'dark-content'}/>
       <Topnav screen={'account'}/>
       {errorMessage && (<NetworkError message={message}/>)}
       <View style={styles.holder}>
       <View style={styles.userProfile}>
         <TouchableOpacity
           style={styles.status}
           onPress={() => navigation.navigate('EditProfile', { userId: userProfile.userId})}
           >
            <Image source={profileImage} style={styles.profileImage} />
            <View style={styles.statusView}>
               <Text style={styles.statusText}>{userStatus}</Text>
             </View>
          </TouchableOpacity>

         <View style={styles.user}>
           <Text style={styles.username}>{username}</Text>
            <View style={styles.joinflex}>
               <FontAwesome5 name="calendar-alt" color="#c0c0c0" size={14}/>
                <Text style={styles.joined}>{joined}</Text> 
            </View>
         </View>
           {/* Followers and following */}
       <View style={styles.followContainer}>
         <TouchableOpacity style={styles.contain}> 
           <Text style={styles.count}>{topicCount}</Text>
           <Text style={styles.placeholder}>Topics</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.contain} onPress={() => handleTabPress('followers')}>
           <Text style={styles.count}>{followersCount}</Text>
           <Text style={styles.placeholder}>Followers</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.contain} onPress={() => handleTabPress('following')}>
            <Text style={styles.count}>{followingCount}</Text>
           <Text style={styles.placeholder}>Following</Text>
         </TouchableOpacity>
         {showModal && (
           <FFModal
               activeTab={activeTab} username={username} profileImage={profileImage}
               userId={userId} showModal={showModal}
               hideModal={hideModal}/>
             )}

        </View>
         <Text numberOfLines={3}  style={styles.about}>{about}</Text>
       </View>
     


     <View style={styles.buttoncontainer}>
       <MyCourse field={field}/>
       <Professional />
      </View>

      
       {/* Platform messages and infor/ promotional/ resourceful */}
       {promoMessage && (
         <View style={styles.promoMessageContainer}>
           <View style={styles.iconContainer}>
             <Image source={promoMessage.profile} style={styles.icon} />
           </View>
           <View style={styles.messageContainer}>
             <Text style={styles.topic}>{promoMessage.topic}</Text>
             <Text style={styles.message}>{promoMessage.message}</Text>
             <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>{promoMessage.action}</Text>
             </TouchableOpacity>
           </View>
         </View>
       )}
       {/* Promo message end */}

         <View style={styles.tabs}><AccountTabs setTopicCount={setTopicCount} userId={userId}/></View>
    </View>
    </View>
      )}/>
  );
};
 

const styles = StyleSheet.create({
  container:{
    backgroundColor: 'white',
  },
  tabs:{
    backgroundColor:'white',
    
  },
  gradient:{
    alignItems:'flex-start',
    left:0, right: 0,
    height: 100,
  },
  topnav: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 5, 
    left:0, right: 0, 
    position: 'absolute',
  },
  setting:{
    position:'absolute',
    right: 20, top: 10
  },
  holder:{
    // borderWidth: 1,
    // top: -40,
  },
  overlay:{
    flexDirection: 'row', 
  },
  profileImage:{
    width: 100, height: 100,
    borderRadius: 100,
    borderWidth: 3, borderColor: 'white',
  },
  status:{
    borderRadius: 100,
    backgroundColor: 'rgba(38,150,184, 0.3)',
    alignItems: 'center', justifyContent: 'center',
    width: 100, height: 100

  },
  statusView:{
    backgroundColor: 'rgba(0,0,0, 0.2)', 
    position: 'absolute', 
    width: '90%', height: '90%',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 100
  },
  statusText:{
    color: 'white', fontWeight: '500',
  },
  userProfile:{
    alignItems: 'center',

  },
  user:{
    alignItems: 'center',
    marginVertical: 5
  },
  username:{
    fontWeight: '600',
  }, 
  field:{
    color: '#2696b8',
  },
 
  about:{
    marginHorizontal: 60,
    alignContent: 'center',
    color: '#707070'
  },
  joinflex:{
    flexDirection: 'row',
    marginTop: 5,  left: 10,
  },
  joined:{
    color: '#c0c0c0',
   marginLeft: 4
  },
  followContainer:{
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between', 
  },
  contain:{
    alignItems: 'center',
     height: 50,
     marginHorizontal: 10,
  },
  placeholder:{
    color: '#a0a0a0'
  },
  count:{
    fontWeight: '600',
    fontSize: 15
  },
  buttoncontainer:{
  marginVertical: 20,marginHorizontal:20,
   flexDirection: 'row',
   justifyContent: 'space-between',

  },
  button:{
    paddingVertical: 10, 
    backgroundColor: 'rgba(38,150,184, 0.6)', width: width* 0.2,
    borderRadius: 10,
  },
  buttonText:{
    color: 'white', alignSelf:'center'
  },
  profileUpdate:{
    padding: 5, position: 'absolute',
    backgroundColor:  'rgba(38,150,184, 0.6)', color: 'white',
    borderRadius: 20, right: 0, bottom: 0,
  },

});
export default Account;
