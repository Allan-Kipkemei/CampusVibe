import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'; // Import the necessary Firestore functions
import { db } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const FollowingFF = ({ MyUserId, active, screen}) => {
  const [followingProfiles, setFollowingProfiles] = useState([]);
  const [loading, setLoading] = useState(false)
  const defaultProfileImage = require('../assets/graduate.png')
  const currentUserId = useSelector((state => state.userProfile.userId))

  useEffect(() => {
    const fetchFollowingProfiles = async () => {
      setLoading(true)
      try {
        const followingQuerySnapshot = await getDocs(
          collection(db, 'userProfiles', MyUserId, active)
        );

        const followingUserIds = followingQuerySnapshot.docs.map(
          (doc) => doc.data().userId
        );

        const followingProfilePromises = followingUserIds.map((userId) =>
          getDoc(doc(db, 'userProfiles', userId))
            .then((snapshot) => ({ userId, userProfile: snapshot.data() }))
            .catch((error) => {
              console.error(`Error fetching user profile for user ID ${userId}:`, error);
              return null;
            })
        );
        setLoading(false)
        const followingProfiles = await Promise.all(followingProfilePromises);
        setFollowingProfiles(followingProfiles);
      } catch (error) {
        console.error('Error fetching following profiles:', error);
      }
    };
    
    fetchFollowingProfiles();
  }, [MyUserId]);


  const navigation = useNavigation()

  const handleNavigation = ({profile}) => {
    if(screen !== 'visitor'){
      if(currentUserId !== profile.userId){
        navigation.replace('BottomTabsRoot', {
         screen: 'VisitUserProfile',
         params: { postUserId: profile.userId }
       });
     }else{
       navigation.replace
         ('BottomTabsRoot', {screen:'Account'})
       }}
       else{return null}
     }

  return (
    <View style={styles.container}>
      {loading  &&(
        <ActivityIndicator />
      )}
      {followingProfiles.map((profile) => (
        <TouchableOpacity
          key={profile.userId}
          onPress={() => handleNavigation({ profile })}
          style={styles.profileContainer}
        >
          <Image
            source={typeof profile.userProfile.profileImageUrl === 'string' ?
            {uri: profile.userProfile.profileImageUrl } : defaultProfileImage} 
            style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{profile.userProfile.username}</Text>
            <Text style={styles.field}>{profile.userProfile.field}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ffff',
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '500',
  },
  field: {
    color: '#888',
  },
});

export default FollowingFF;
