import { React, useState, useEffect, useRef} from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Keyboard } from 'react-native';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc} from 'firebase/firestore';
import { db, app} from '../firebase/firebase';
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';


const CreateComment = ({postId, tag, setTag}) => {
    const [reply, setReply] = useState('');
    const userId = useSelector((state) => state.userProfile.userId);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const replyInputRef = useRef(null);
   
    useEffect(() => {
      if (tag) {
        setReply(`@${tag.tagName}, `);
  
        // Use Keyboard.dismiss() and setTimeout to show the keyboard after a short delay
        Keyboard.dismiss();
        setTimeout(() => {
          if (replyInputRef.current) {
            replyInputRef.current.focus();
          }
        }, 100);
      }
    }, [tag]);

    useEffect(() => {
      if (reply.length === 0) {
        setTag(null);
      }
    }, [reply]);
    

    //   Send comments to subcollection
    const handleCommentSubmit = () => {
      if (reply.trim() !== '') {
        const addComment = async (postId, comment) => {
          try {
            const commentRef = collection(db, 'Posts', postId, 'comments');
            const handleImageUpload = async (image) => {
              setLoading(true);
              const storage = getStorage(app);
              const storageRef = ref(storage, `images/${Date.now()}_${image}`);
              
              // Fetch image data
              const response = await fetch(image);
              const blob = await response.blob();
              
              // Upload image data to Firebase Storage
              const uploadTask = uploadBytes(storageRef, blob);
              await uploadTask;
              
              // Get the download URL for the uploaded image
              const downloadURL = await getDownloadURL(storageRef);
              return downloadURL;
            };

            // Update existing coment when replying
            const updateComment = async() =>{
              const commentRef = doc(db, 'Posts', tag.postId, 'comments', tag.commentId);
              const commentSnapshot = await getDoc(commentRef);
              const commentData = commentSnapshot.data();
              const repliesArray = commentData?.commentReplies || [];
              repliesArray.push(userId);

             // Update the comment document with the new 'replies' array
             await updateDoc(commentRef, {
               commentReplies: repliesArray,
              });
            }

            if(tag){
              updateComment();
            }
            
            let downloadURL = '';
            if (image){
            downloadURL = await handleImageUpload(image);
            }

            await addDoc(commentRef, {
              userId,
              reply,
              downloadURL,
              timestamp: serverTimestamp(),
              tag: { tagId: tag ? tag.tagId : null, tagName: tag ? tag.tagName : null },
            });
  
            // alert('Comment added successfully')
          } catch (error) {
            alert('Failed to add comment')
            console.error('Error adding comment: ', error);
          }
        };
        addComment(postId, reply, image);
        setReply('');
        setImage(null);
        setTag(null)
      }
    };

    const selectImage = async () => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }
    
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    
      if (!result.canceled) {
        setImage(result.uri);
      }
    };
    const handleDeleteImage = () => {
        setImage(null);
      };
      

  return (
    <View style={styles.bottomnav}>
        {image && (
         <View style={styles.viewimage}>
             <Image source={{ uri: image }} style={styles.setimage} />
             <TouchableOpacity onPress={handleDeleteImage} style={styles.deleteButton}>
                  <FontAwesome name="times" size={20} color="#2696b8" />
               </TouchableOpacity>
           </View>
        )}
      <TouchableOpacity onPress={selectImage} style={styles.attachmentIcon}>
         <FontAwesome name="image" size={20} color="rgba(38, 150,184,0.7)" />
      </TouchableOpacity>
      <TextInput 
        ref={replyInputRef}
        style={styles.topicInput}
        placeholder="Join the conversation"
        onChangeText={setReply}
        value={reply}
        maxLength={300}
      />
      <TouchableOpacity onPress={handleCommentSubmit}style={styles.attachmentIcon}>
        {loading ? (<ActivityIndicator />) 
          :( <FontAwesome name="send-o" size={20} color="rgba(38, 150,184,0.7)" />)}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    bottomnav:{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: 10, backgroundColor: 'white',
        flexDirection: 'row', borderTopWidth:3, borderTopColor: '#f8f8f8',
    },
    topicInput:{
        borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 10,
        padding: 10,  flex: 1,
    },
    attachmentIcon: {
        height: 30,
        width: 35,
        marginVertical: 10,
        alignItems: 'center', justifyContent: 'center'
        
    },
    setimage:{
         height: 200,
         borderRadius: 20,
    },
    viewimage:{
        height: 200,
        left: 10, right: 10,bottom: 70, 
       position: 'absolute',
   },
   deleteButton:{
    borderRadius: 100, backgroundColor: 'white',
     width: 25, height:25,
    alignItems: 'center', justifyContent: 'center',
    position:'absolute', margin:10,
  },
    
});

export default CreateComment;
