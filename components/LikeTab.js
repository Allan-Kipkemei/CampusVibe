import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { getFirestore, updateDoc, doc , getDoc, onSnapshot} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useSelector } from 'react-redux';
import PostModal from "../screens/Comments.js";
import { FontAwesome5 } from '@expo/vector-icons';
import ShareModal from './ShareModal';


const PostTab = ({postId, postUserId, type}) => {
  const userId = useSelector((state) => state.userProfile.userId);
  const isCurrentUserPost = userId === postUserId;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState('');
  const [dislikeCount, setDislikeCount] = useState('');

// Function to convert large numbers to abbreviated format
const formatNumber = (number) => {
  const abbreviations = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
  ];

  for (const abbreviation of abbreviations) {
    if (number >= abbreviation.value) {
      return (number / abbreviation.value).toFixed(1).replace(/\.0$/, '') + abbreviation.symbol;
    }
  }

  return number.toString();
};



  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'Posts', postId), (doc) => {
      const likes = doc.data()?.likes || [];
      const dislikes = doc.data()?.dislikes || [];
      setLikeCount(formatNumber(likes.length));
      setDislikeCount(formatNumber(dislikes.length));
      setLiked(likes.includes(userId));
      setDisliked(dislikes.includes(userId));
    });

    return unsubscribe;
  }, [postId, userId]);

  
  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      if (disliked) {
        setDisliked(false);
        await updateDislikes(postId, userId, false);
      }
      await updateLikes(postId, userId, true);
    } else {
      setLiked(false);
      await updateLikes(postId, userId, false);
    }
  };
  
  const handleDislike = async () => {
    if (!disliked) {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        await updateLikes(postId, userId, false);
      }
      await updateDislikes(postId, userId, true);
    } else {
      setDisliked(false);
      await updateDislikes(postId, userId, false);
    }
  };
  
  const updateLikes = async (postId, userId, add) => {
    try {
      const postRef = doc(db, "Posts", postId);
      const postDoc = await getDoc(postRef);
      const likes = postDoc.data().likes || [];
      if (add) {
        likes.push(userId);
      } else {
        const index = likes.indexOf(userId);
        if (index !== -1) {
          likes.splice(index, 1);
        }
      }
      await updateDoc(postRef, { likes });
    } catch (error) {
      console.error("Error updating post likes: ", error);
    }
  };
  
  const updateDislikes = async (postId, userId, add) => {
    try {
      const postRef = doc(db, "Posts", postId);
      const postDoc = await getDoc(postRef);
      const dislikes = postDoc.data().dislikes || [];
      if (add) {
        dislikes.push(userId);
      } else {
        const index = dislikes.indexOf(userId);
        if (index !== -1) {
          dislikes.splice(index, 1);
        }
      }
      await updateDoc(postRef, { dislikes });
    } catch (error) {
      console.error("Error updating post dislikes: ", error);
    }
  };
  
  
  const handleComment = () => {
    setCommentsModalVisible(!commentsModalVisible);
  };


   // open comments with modal
   const [commentsModalVisible, setCommentsModalVisible] = useState(false);
   function openComments(postId) {
     setCommentsModalVisible(true);
   }


  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={handleLike}>
        <View style={styles.row}>
        {liked ? (
          <Image source={require('../assets/Like.png')} style={styles.iconlike} />
        ) : (
          <Image source={require('../assets/Likeinactive.png')} style={styles.iconlike} />
        )}
        <Text style={styles.count}>{likeCount}</Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity onPress={handleDislike}>
      <View style={styles.row}>
        {disliked ? (
          <Image source={require('../assets/dislike.png')} style={styles.icondislike} />
        ) : (
          <Image source={require('../assets/dislikeinactive.png')} style={styles.icondislike} />
        )}
        <Text style={styles.count}>{dislikeCount}</Text>
        </View>
      </TouchableOpacity>

      <PostModal
        postId={postId}
        modalVisible={commentsModalVisible}
       setModalVisible={setCommentsModalVisible}
      />
      <ShareModal postId={postId} current={isCurrentUserPost}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // width: 350,
    alignItems: 'center',
   
    left: 0, right: 0,
    justifyContent:'space-between',
    paddingTop: 10,
     paddingHorizontal: 20
  },
  like:{
    flexDirection: 'row',
  },
  count: {
    fontSize: 13, fontWeight: '500', color: '#a0a0a0',
    marginLeft: 5, marginTop: 4,
  },
  iconlike: {
    width: 22,
    height: 22,
  },
  icondislike: {
    width: 25,
    height: 25,
  },
  row:{
    flexDirection: 'row',
    alignItems:'center'
  }
});

export default PostTab;
