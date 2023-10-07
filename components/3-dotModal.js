import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import { FontAwesome5, Feather, Ionicons, MaterialIcons} from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import { deleteDoc, doc,collection,getDoc, updateDoc, serverTimestamp, onSnapshot, where, setDoc, query        } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import RepostModal from './Repost';


const ThreeDot = ({ postId, postUserId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const userProfile = useSelector((state) => state.userProfile);
  const currentUserId = userProfile.userId;
  const [isFollowing, setIsFollowing] = useState(false);
  const isCurrentUserPost = currentUserId === postUserId;
  const [followingMe, setFollowingMe] = useState(false);
  const [isPinned, setPinned] = useState(false)
  const navigation = useNavigation();


// if the post is owned by the current user
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'Posts', postId));
      console.log('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
    setLoading(false);
    setModalVisible(false);
  };

// If the post isnt owned by current user
// Check if current user is following the post creator
  if (!isCurrentUserPost) {
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
    }      


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

const handlePin = () =>{
  
}

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


function handleSave(){}
function handleReport(){}




  return (
    <View style={styles.postContainer}>
      <TouchableOpacity style={styles.optionsButton} onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="ellipsis-v" size={14} color="#a0a0a0" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          

          {/* other menus here */}
          {!isCurrentUserPost? (
               <TouchableOpacity style={styles.modalOption} onPress={() =>handleRepost(postId)}>
                  <Feather name="repeat" size={20} color="black" />
                  <Text style={styles.modalOptionText}>Repost</Text>
               </TouchableOpacity>
            ) : (null)}
              {repostVisible && selectedPostId && (
              <RepostModal
                 postId={selectedPostId}
                 isVisible={repostVisible}
                 onClose={handleModalClose}
               />
              )}

             {isCurrentUserPost? (
               <TouchableOpacity style={styles.modalOption} onPress={handleRepost}>
                  <Feather name="edit" size={20} color="black" />
                  <Text style={styles.modalOptionText}>Edit </Text>
               </TouchableOpacity>
            ) : (null)}

             {isCurrentUserPost? (
               <TouchableOpacity style={styles.modalOption} onPress={handlePin}>
                  <FontAwesome5 name="map-pin" size={20} color="black" />
                  <Text style={styles.modalOptionText}>
                    {isPinned ? ('Pin to my profile') : ('Unpin from profile')}
                    </Text>
               </TouchableOpacity>
            ) : (null)}
            
          {isCurrentUserPost ? (
           <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
              
              {isLoading ? (<ActivityIndicator size={'small'} color={'#2696b8'}/>)
              :(<MaterialIcons name="delete-outline" size={24} color="black" />)}          
               <Text style={styles.modalOptionText}>Delete Post</Text>
             </TouchableOpacity>
           ) : (
            <TouchableOpacity style={styles.modalOption} onPress={handleFollow}>
              {isFollowing ? (<Feather name="user-minus" size={20} color="black" />) : (
                <Feather name="user-plus" size={20} color="black" />
              )}
               <Text style={styles.modalOptionText}>
               {isFollowing ? 'Unfollow' : 'Follow'}
               </Text>
             </TouchableOpacity>
            )}
          
               {!isCurrentUserPost? (
               <TouchableOpacity style={styles.modalOption} onPress={handleSave}>
                  <Feather name="bookmark" size={20} color="black" />
                  <Text style={styles.modalOptionText}>Add to favourites</Text>
                  {isLoading && (<ActivityIndicator size={'small'} color={'#2696b8'}/>)}
               </TouchableOpacity>
            ) : (null)}

               {!isCurrentUserPost? (
               <TouchableOpacity style={styles.modalOption} onPress={handleReport}>
                  <Feather name="alert-triangle" size={20} color="black" />
                  <Text style={styles.modalOptionText}>Report</Text>
               </TouchableOpacity>
            ) : (null)}

          <TouchableOpacity style={styles.modalOption} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="black" />
            <Text style={styles.modalOptionText}>Cancel</Text>
          </TouchableOpacity>


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
    right: 0, top: 0,
    // borderWidth:1,
     paddingHorizontal: 15, paddingVertical:22
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
});

export default ThreeDot;
