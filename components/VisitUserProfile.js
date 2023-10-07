import React, { useState, useEffect} from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Dimensions,Image, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons, Ionicons} from '@expo/vector-icons';
import { getFirestore, doc, getDoc, onSnapshot, setDoc, deleteDoc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import FullProfileView from './FullProfileView';
import { useSelector } from 'react-redux';
import { db } from '../firebase/firebase';
import AccountTabs from '../screens/AccountTabs';
import FFModal from '../screens/FFView';

const VisitUserProfile = ({route}) => {
    const navigation = useNavigation()

    // Current user details
  const userProfile = useSelector((state => state.userProfile))
  const currentUserId = userProfile.userId;
  const {postUserId} = route.params;

     // Fecth user profile using userId
  const defaultProfileImage = require('../assets/graduate.png');
  const [username, setUsername] = useState('Student');
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [field, setField] = useState('Guest')
  const [yearOfAdmission, setYear] = useState(2020)
  const [user, setUserType] = useState('student')
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);
  const [about, setAbout] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const userRef = doc(db, 'userProfiles', postUserId);
      const userDoc = await getDoc(userRef);
     
      if (userDoc.exists()) {
        const { username, profileImageUrl, field, yearOfAdmission, userId, user, about} = userDoc.data();
        setUsername(username);
        setUserType(user);
        setAbout(about);
        setField(field);
        setYear(yearOfAdmission);
        if (typeof profileImageUrl === 'string') {
          setProfileImage({ uri: profileImageUrl });
        } 
      }
    };
    fetchUserProfile();
  }, [postUserId]);

  const [fullImage, setFullImage] = useState(false)
  const showFullProfile = () => {
    if(profileImage){
      setFullImage(true)
    }
  }
  const hideFullImage = () =>{
    setFullImage(false)
  }

  // Fetch following followers counts
  if (postUserId) {
    useEffect(() => {
      const unsubscribeFollowers = onSnapshot(
        collection(db, "userProfiles",postUserId, "followers"),
        (snap) => setFollowersCount(snap.size)
      );
      const unsubscribeFollowing = onSnapshot(
        collection(db, "userProfiles", postUserId, "following"),
        (snap) => setFollowingCount(snap.size)
      );
  
      return () => {
        unsubscribeFollowers();
        unsubscribeFollowing();
      };
    }, [postUserId]);
  }

  // Set year and Student account type
  const currentYear = new Date().getFullYear();
  const startYear = yearOfAdmission;
  const endYear = Number(startYear) + 4;
  let joined = "";
  if (user.toLowerCase() === "student") {
    joined = `Joined: ${startYear} - ${endYear}`;
  } else if (user.toLowerCase() === "service") {
    joined = `Joined: ${startYear} to date`;
  }
  const userStatus = currentYear >= endYear ? "Alumni" : "Active";

  // Check following
  const [isFollowing , setIsFollowing] = useState(false)
  const [followingMe, setFollowingMe] = useState(false)
  console.log('is following:', isFollowing , 'follow back:', followingMe)
  useEffect(() => {
    const userDocRef = doc(db, 'userProfiles', currentUserId);
    const followingRef = collection(userDocRef, 'following');
    const followersRef = collection(userDocRef, 'followers');
  
    const followingUnsubscribe = onSnapshot(query(followingRef, where('userId', '==', postUserId)), (snapshot) => {
      setIsFollowing(!snapshot.empty);
    });
  
    const followersUnsubscribe = onSnapshot(query(followersRef, where('userId', '==', postUserId)), (snapshot) => {
      setFollowingMe(!snapshot.empty);
    });
  
    return () => {
      followingUnsubscribe();
      followersUnsubscribe();
    };
  }, [postUserId, currentUserId]);
  

  // Handle function according to whether the current user is follwoing the post creator or not
  const handleFollow = async () => {
    const userDocRef = doc(db, 'userProfiles', currentUserId);
    const userDocRef2 = doc(db, 'userProfiles', postUserId);
    const followingRef = collection(userDocRef, 'following');
    const followersRef = collection(userDocRef2, 'followers');

    if (isFollowing) {
      try {
        await deleteDoc(doc(followingRef, postUserId));
        await deleteDoc(doc(followersRef, currentUserId))
        setIsFollowing(false);
      } catch (error) {
        console.error('Error following/unfollowing user: ', error);
      }
    } else {
      try {
        await setDoc(doc(followingRef, postUserId), { createdAt: serverTimestamp(), userId: postUserId });
        await setDoc(doc(followersRef, currentUserId), { createdAt: serverTimestamp(), userId: currentUserId });
        setIsFollowing(true);
      } catch (error) {
        console.error('Error following/unfollowing user: ', error);
      }
    };
}

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
      data={[{ key: 'Account' }]}
      showsVerticalScrollIndicator={false}
      renderItem={() => (
     <View style={styles.modal}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()}  style={styles.back}>
              <MaterialIcons name="arrow-back" size={25} color="#000" />
           </TouchableOpacity>
           <Text style={styles.sett}>{username}</Text>
           <FontAwesome5 name="ellipsis-v" size={20} color="#707070" style={styles.menu}/>
        </View>
            {/* Body */}

        <View style={styles.body}>
          <TouchableOpacity onPress={showFullProfile}>
             <Image source={profileImage} style={styles.profile}/>
             <View style={styles.statusView}>
               <Text style={styles.statusText}>{userStatus}</Text>
              </View>
              </TouchableOpacity>
              {fullImage && (
                <FullProfileView hideFullImage={hideFullImage} profileImage={profileImage}/>
              )}

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
               userId={postUserId} showModal={showModal} screen={'visitor'}
               hideModal={hideModal}/>
             )}

        </View>
                <Text numberOfLines={3}  style={styles.about}>{about}</Text>

                <View style={styles.buttoncontainer}>
                  {isFollowing ? (
                    <TouchableOpacity style={styles.button} onPress={handleFollow}>
                      <Text style={styles.buttonText}>Unfollow</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.followbtn} onPress={handleFollow}>
                      <Text style={styles.followtxt}>
                        {followingMe ? ( 'Follow Back') :  (' Follow ')}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Message</Text>
                  </TouchableOpacity>
                 </View>
             
            </View>

            <View style={styles.tabs}><AccountTabs setTopicCount={setTopicCount} userId={postUserId}/></View>
       
      </View>
      )}/>
    );
  };
  

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#ffff',
  },
  header:{
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
    // position: 'absolute',
    // top: 62, 
    left:0, right: 0,bottom: 0,
    backgroundColor: 'white',
    alignItems:'center',
    // borderWidth: 1
  },
  profileImage: {
    borderRadius: 100,
    width: 45,
    height: 45,
  },
  usernameField: {
    marginLeft: 6,
    // alignItems: 'center',
  },
  userProfile: {
    marginTop: 5,marginLeft: 5,
    flexDirection: 'row',
  },
  username:{
    fontWeight: '500',
    marginLeft: 5, marginTop: 5,
  },
  field:{
    color: '#404040', marginLeft: 1,
    marginTop: 5,
  },
  menu:{
    position: 'absolute',
    right: 20, alignSelf: 'center'
  },
  profile:{
    width: 100, height: 100,
    borderRadius: 100,
    borderWidth: 3, borderColor: 'white',
  },
  statusView:{
    backgroundColor: 'rgba(0,0,0, 0.2)', 
    position: 'absolute', 
    width: 100, height: 100,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 100
  },
  statusText:{
    color: 'white', fontWeight: '500',
  },
  joinflex:{
    flexDirection: 'row',
    marginTop: 5,  left: 10,
  },
  joined:{
    color: '#c0c0c0',
   marginLeft: 4
  },
  user:{
    alignItems: 'center',
    marginVertical: 5
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
    fontWeight: '600', fontSize: 17
  },
  buttoncontainer:{
     marginVertical: 20,
   flexDirection: 'row',
   justifyContent: 'space-between',
   width: '75%', 
  //  borderWidth: 1
  },
  button:{
    width: 120,
    paddingVertical: 10, paddingHorizontal: 10,
    backgroundColor: '#f6f6f6', 
    // borderWidth: 1, borderColor: '#c0c0c0',
    borderRadius: 10, alignItems: 'center'
  },
  about:{
   color: '#707070'
  },
  followbtn:{
  width: 120,
    paddingVertical: 10, paddingHorizontal: 10,
    backgroundColor: 'rgba(38,150,184,0.8)', 
    // borderWidth: 1, borderColor: '#c0c0c0',
    borderRadius: 10, alignItems: 'center'
  },
  followtxt:{
    fontWeight: '500', color: 'white'
  }


 
});

export default VisitUserProfile;
