import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator, ScrollView, Dimensions} from 'react-native';
import { Ionicons, AntDesign, Feather, FontAwesome} from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../firebase/firebase';
import RepostModal from './Repost';


const ShareModal = ({postId, current}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const userProfile = useSelector((state) => state.userProfile);
  const currentUserId = userProfile.userId;
  const [followerProfiles, setFollowerProfiles] = useState([]);


  const fetchFollowerProfiles = async () => {
    try {
      setLoading(true);
  
      // Create a reference to the 'following' subcollection
      const followingRef = collection(db, 'userProfiles', currentUserId, 'following');
  
      // Fetch all documents in the 'following' subcollection
      const querySnapshot = await getDocs(followingRef);
  
      // Map the query snapshot to an array of follower user IDs
      const followerUserIds = querySnapshot.docs.map((doc) => doc.data().userId);
  
      // Fetch user profile documents of the following users
      const followerProfiles = await Promise.all(
        followerUserIds.map(async (userId) => {
          const profileDocRef = doc(db, 'userProfiles', userId);
          const profileDocSnapshot = await getDoc(profileDocRef);
  
          if (profileDocSnapshot.exists()) {
            return profileDocSnapshot.data();
          }
          return null;
        })
      );
  
      // Remove null values from followerProfiles
      const filteredFollowerProfiles = followerProfiles.filter((profile) => profile !== null);
  
      setFollowerProfiles(filteredFollowerProfiles);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching follower profiles:', error);
      setLoading(false);
    }
  };
  
// Repost logic
  const [repostVisible, setRepostVisible] = useState(false);
const [selectedPostId, setSelectedPostId] = useState(null);

const handleRepost = (postId) => {
  // Code to handle repost logic, and then open the modal
  setSelectedPostId(postId);
  setRepostVisible(true);
};

const handleModalClose = () => {
  setRepostVisible(false);
  setModalVisible(false)
};

  return (
    <View style={styles.postContainer}>
      <TouchableOpacity onPress={() => {setModalVisible(true);fetchFollowerProfiles();}}>
        <Image source={require('../assets/share.png')} style={styles.iconshare} />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={[styles.modalContainer, { maxHeight: Dimensions.get('window').height * 0.75 }]}>
          <View style={styles.headerbtn}>
            <Text style={styles.header}>Share With</Text>
            {isLoading ? (
              <ActivityIndicator size={'small'} color={'#2696b8'}/>
            ) : (
              <TouchableOpacity onPress={() => setModalVisible(false)}>  
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>         
            )}
          </View>

          <ScrollView>
            {followerProfiles.length > 0 ? (
              followerProfiles.map((profile) => (
                <TouchableOpacity
                  key={profile.userId}
                  style={styles.container}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: profile.profileImageUrl }} style={styles.profileImage} />
                  <View style={styles.profileContainer}>
                    <Text style={styles.username}>{profile.username}</Text>
                    <Text style={styles.field}>{profile.field}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.empty}>Follow other users to share posts</Text>
            )}
          </ScrollView>

          <ScrollView style={styles.bottom} horizontal={true} showsHorizontalScrollIndicator={false}>
            {!current  && (
            <TouchableOpacity style={styles.button} onPress={() => handleRepost(postId)}>
               <AntDesign name="retweet" size={24} color="black" style={styles.icon}/>
               <Text style={styles.label}>Repost</Text>
            </TouchableOpacity>)}
            {repostVisible && selectedPostId && (
              <RepostModal
                 postId={selectedPostId}
                 isVisible={repostVisible}
                 onClose={handleModalClose}
               />
              )}


            <TouchableOpacity style={styles.button}>
               <AntDesign name="link" size={24} color="black" style={styles.icon}/>
               <Text style={styles.label}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
               <FontAwesome name="whatsapp" size={24} color="black" style={styles.icon} />
               <Text style={styles.label}>Whatsapp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
               <Feather name="facebook" size={24} color="black" style={styles.icon}/>
               <Text style={styles.label}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
               <FontAwesome name="instagram" size={24} color="black" style={styles.icon}/>
               <Text style={styles.label}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
               <Feather name="twitter" size={24} color="black" style={styles.icon}/>
               <Text style={styles.label}>Twiter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
               <AntDesign name="message1" size={24} color="black" style={styles.icon}/>
               <Text style={styles.label}>Messages</Text>
            </TouchableOpacity> 
          </ScrollView>

        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionsButton: {
    position:'absolute',
    right: 10, top: 20,
     padding: 5
  },
  modalContainer: {
    borderWidth: 1, borderColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 25, borderTopRightRadius: 25,
    padding: 10
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 2,
  },
  modalOptionText: {
    fontWeight: '500',
    marginLeft: 10
  },

  iconshare: {
    width: 20,
    height: 20, marginTop: 3,
  },
  container:{
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  profileImage:{
    width: 40, height: 40, borderRadius: 100
  },
  profileContainer:{
    marginLeft: 10
  },
  headerbtn:{
    flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'space-between',
    paddingRight: 20
  },
  header:{
    fontSize: 15, fontWeight: '700',
    paddingVertical: 10
  },
  bottom:{
    backgroundColor: 'white',
    flexDirection: 'row',
    padding:10,
    borderTopColor: '#f0f0f0', borderTopWidth:1, marginTop:20
  },
  icon:{
    borderRadius:100, elevation:1,
    backgroundColor: '#f8f8f8',padding:10
  },
  button:{
    alignItems: 'center', marginHorizontal:10
  }
});

export default ShareModal;
