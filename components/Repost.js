import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, ScrollView, Dimensions} from 'react-native';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db, app} from '../firebase/firebase';
import { Entypo, Ionicons} from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { useSelector } from 'react-redux';
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from 'react-native-paper';

const {width, height} = Dimensions.get('window')

const RepostModal = ({ postId, isVisible, onClose }) => {
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [originalPost, setOriginalPost] = useState(null);
  const [updatedPost, setUpdated] = useState(null)
  const [editedMessage, setEditedMessage] = useState('');
  const [errorMessage, setNetworkError] = useState(null);
  const [newMedia, setNewMedia] = useState(null);
  const userId = useSelector((state => state.userProfile.userId))
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchPostData();
    }
  }, [isVisible]);

  const fetchPostData = async () => {
    try {
      // Fetch the original post data
      const postRef = doc(db, 'Posts', postId);
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        setOriginalPost(postSnapshot.data());

        // Fetch the creator's profile data
        const creatorRef = doc(db, 'userProfiles', postSnapshot.data().userId);
        const creatorSnapshot = await getDoc(creatorRef);
        if (creatorSnapshot.exists()) {
          setCreatorProfile(creatorSnapshot.data());
        } else {
          console.warn('Creator profile not found');
        }

        // Prefill the message in the TextInput
        setEditedMessage(postSnapshot.data().message);
      } else {
        console.warn('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      setNetworkError('No internet connection!')
    }
  };

const handleRepost = async () => {
  setLoading(true)
  const handleImageUpload = async (newMedia) => {
    setLoading(true)
    const storage = getStorage(app);
    const storageRef = ref(storage, `Posts/${Date.now()}_${newMedia}`);
    
    // Fetch image data
    const response = await fetch(newMedia);
    const blob = await response.blob();
    
    // Upload image data to Firebase Storage
    const uploadTask = uploadBytes(storageRef, blob);
    await uploadTask;
    
    // Get the download URL for the uploaded image
    const media = await getDownloadURL(storageRef);
    setLoading(false)
    return media;
  };

  let media = null;
  if (newMedia){
  media = await handleImageUpload(newMedia);
  }
  const downloadURL = media? media: originalPost.downloadURL;
  const imageTag = newMedia ? 'repost' : originalPost.imageTag;

  try {
    const repostRef = collection(db, 'Posts'); 
    const repostData = {
      type: 'repost', originalID: creatorProfile.userId,
      userId: userId,
      topic: originalPost.topic,
      audience: originalPost.audience,
      message: editedMessage,
      vibe: creatorProfile.username,
      topicTag: originalPost.topicTag,
      downloadURL: downloadURL? downloadURL : '', 
      imageTag: imageTag,
      tagList: originalPost.tagList, createdAt: serverTimestamp(),
    };
    const newRepostDoc = await addDoc(repostRef, repostData); 

    // Link the new repost to the original post using the postId
    const originalPostRef = doc(db, 'Posts', postId);
    
    await updateDoc(originalPostRef, {
      repostIds: arrayUnion(newRepostDoc.id),
    });
  

    setLoading(false)
    onClose();
  } catch (error) {
    setNetworkError(error)
    console.error('Error creating repost:', error);
  }
};

  if (!originalPost || !creatorProfile) {
    console.log(errorMessage)
    return(
      null
    );
  }

  const defaultProfileImage = require('../assets/graduate.png');
   const handleMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Camera permission denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewMedia(result.uri);
    }
  };
  

  const handleDelete = (mediaType) => {
    if (mediaType === 'original') {
      const updatedPost = { ...originalPost };
      delete updatedPost.downloadURL;
      setOriginalPost(updatedPost);
    } else if (mediaType === 'newMedia') {
      setNewMedia(null);
    }
  };
  
  

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose} >
      <ScrollView  style={styles.container}>
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size={'small'} color='#2696b8'/>
          </View>
        )}
        <View style={styles.profile}>
           <Image source={creatorProfile.profileImageUrl ? {uri :creatorProfile.profileImageUrl} : defaultProfileImage} style={styles.profileImage}/>
           <Text style={styles.label}>Reposting from {creatorProfile.username}</Text>
           <TouchableOpacity onPress={onClose} style={styles.close}>
               <Ionicons name="close-sharp" size={30} color="black" />
           </TouchableOpacity>
        </View>
        <Text style={styles.label}>Topic</Text>
        <Text style={styles.topic}>
           {originalPost.topic ? (
           originalPost.topic.length > 20
            ? originalPost.topic.substring(0, 20) + '...'
           : originalPost.topic
           ) : null}
         </Text>

        <Text style={styles.topictext}>{}</Text>
        <Text style={styles.label}>Edit your message</Text>
        <TextInput
           style={styles.messageInput}
           value={editedMessage}
           onChangeText={setEditedMessage}
           placeholder="Write your message"
           multiline
           textAlignVertical="top" 
           padding={5} 
          />

       {originalPost.downloadURL ? (
       <View style={styles.holder}> 
         <TouchableOpacity style={styles.clear} onPress={() =>handleDelete('original')}>
           <Ionicons name="close-sharp" size={24} color="black" />  
         </TouchableOpacity>
         <Image source={{ uri: originalPost.downloadURL }} style={styles.Image} />
        <Text style={styles.label}>You can choose {'\n'} to clear media</Text>
       </View>
       ) : newMedia ? (
       <View style={styles.holder}> 
          <TouchableOpacity style={styles.clear} onPress={() =>handleDelete('newMedia')}>
            <Ionicons name="close-sharp" size={24} color="black" />  
          </TouchableOpacity>
         <Image source={{ uri: newMedia }} style={styles.Image} />
         <Text style={styles.label}>You can choose {'\n'} to clear media</Text>
        </View>
       ) : (
       <TouchableOpacity style={styles.attachment} onPress={handleMedia}>
         <Entypo name="attachment" size={24} color="#a0a0a0" />
         <Text style={styles.label}>Add attachment</Text>
        </TouchableOpacity>
       )}

    <TouchableOpacity style={styles.repostButton} onPress={handleRepost}>
      <Text style={styles.repostButtonText}>Repost</Text>
    </TouchableOpacity>
    <View style={{paddingBottom:100}}></View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    marginTop: '50%', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20, 
    borderWidth:1, borderColor: '#ddd',
    
  },
  label:{
    color:'#a0a0a0'
  },
  topic: {
    fontSize: 16,
    fontWeight: '800',
    // marginBottom: 10,
  },
  messageInput: {
    width: '90%',
    height:100, 
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  repostButton: {
    backgroundColor: '#2696b8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5, alignItems: 'center',
    marginVertical:10
  },
  repostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profile:{
    flexDirection:'row', 
    alignItems: 'center',
    marginBottom:10
  },
  profileImage:{
    width:30, height: 30, marginRight:10, borderRadius:100
  },
  attachment:{
    flexDirection:'row', 
    alignItems: 'center',
    marginVertical:10
  },
  Image:{
    width:100, height:150,
    borderWidth:1, borderRadius:10,marginRight:20
  },
  close:{
    position: 'absolute', right:0,
    padding:5,
  },
  clear:{
    backgroundColor: 'white', borderRadius:100,
    position: 'absolute', zIndex:2, top:0, margin:4
  },
  holder:{
    flexDirection: 'row', alignItems: 'center'
  }
});

export default RepostModal;
