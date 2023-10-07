import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


const defaultProfileImage = require('../assets/graduate.png');

const CommentsSnippet = ({ comment, setTag, postId}) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('Student');
  const [profileImage, setProfileImage] = useState(null);
  const [timeAgo, setTimeAgo] = useState('1s');
  const [date, setDate] = useState(null);
  const [liked, setLiked] = useState(false);
  const userProfile = useSelector((state => state.userProfile))
  const currentUserId = userProfile.userId;
  const postUserId = comment.userId;

  const processReplyText = () => {
    const words = comment.reply.split(' ');
    return words.map((word, index) => {
      if (word.startsWith('@')) {
        return (
          <Text style={styles.tagged} key={index}>
            {word}{' '}
          </Text>
        );
      }
      return (
        <Text key={index} style={styles.commentline}>
          {word}{' '}
        </Text>
      );
    });
  };
  
  

useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const userRef = doc(db, 'userProfiles', comment.userId);
      const userDoc = await getDoc(userRef);
     
      if (userDoc.exists()) {
   
        const { username, profileImageUrl } = userDoc.data();
        setUsername(username);
        if (profileImageUrl) {
          setProfileImage({ uri: profileImageUrl });
        } 
      }
    };
    fetchUserProfile();
  }, [comment.userId]);

  useEffect(() => {
    if (comment.timestamp) {
      const now = moment();
      const commentTime = moment(comment.timestamp.toDate());
      const diff = moment.duration(now.diff(commentTime));
      if (diff.asSeconds() < 60) {
        setTimeAgo(`${Math.floor(diff.asSeconds())}s`);
      } else if (diff.asMinutes() < 60) {
        setTimeAgo(`${Math.floor(diff.asMinutes())}m`);
      } else if (diff.asHours() < 24) {
        setTimeAgo(`${Math.floor(diff.asHours())}h`);
      } else {
        setTimeAgo(`${Math.floor(diff.asDays())}d`);
      }
      setDate(commentTime.format('MMMM DD YYYY'));
    }
  }, [comment.createdAt]);

  const handleVisitProfile = () =>{
    const isCurrentUser = currentUserId === postUserId;  
    if(!isCurrentUser){
      navigation.navigate('BottomTabsRoot', {
        screen: 'VisitUserProfile',
        params: { postUserId: postUserId }
      });
    }else{
      navigation.navigate('BottomTabsRoot', {screen: 'Account'})
    }
  }
  
  const handleTag = () => {
    setTag({
      tagId: comment.userId,
      tagName: username,
      commentId: comment.id,
      postId: postId,
    });
  };
  
  return (
    <View style={styles.commentContainer}>
       <Image  style={styles.profileImage} source={profileImage || defaultProfileImage}/>
          <View style={styles.body}>
             <View style={styles.unameTime}>
                 <TouchableOpacity onPress={handleVisitProfile} activeOpacity={0.8}>
                     <Text style={styles.username}>{username}</Text>
                 </TouchableOpacity>
                 <Text style={styles.time}>{timeAgo}</Text>
             </View>

             <Text style={styles.comment}>
               {processReplyText()}
            </Text>

             <View style={styles.attachment}>
                {comment.downloadURL ? (
                 <View style={styles.attachment}>
                  <Image style={styles.photo} source={{ uri: comment.downloadURL }} /> 
                  {comment.imageTag ? (
                   <Text style={styles.imageTag}>{comment.imageTag}</Text>
                    ) : null}
                </View>
              ) : null}
            </View>
            <View style={styles.commentbuttons}>
                <TouchableOpacity onPress={handleTag}>
                    <Text style={styles.button}>Reply</Text>
                </TouchableOpacity>
            </View>
          </View>
          <View style={styles.likebtn}>
             <TouchableOpacity onPress={() => {setLiked(!liked);}} style={styles.tbutton}>
               <FontAwesome5 name="heart" size={14} color={liked ? "red" : "#a0a0a0"} />
              </TouchableOpacity>
              <Text>{comment.likes}</Text>
          </View>

    </View>
  );
};

const styles = StyleSheet.create({
    commentContainer:{
        flexDirection: 'row',
        padding: 15,paddingTop: 10, 
        
    }, 
    profileImage: {
        borderRadius: 100,
        width: 45,
        height: 45, 
      },
      body:{
       justifyContent: 'space-between', 
        marginLeft: 10, 
        width: 280,
        borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
      },
      username:{
        fontWeight: '500'
      },
      time:{
        color: '#a0a0a0', marginLeft: 20,
      },
      unameTime:{
        flexDirection: 'row', 
      }, 
      photo: {
        borderWidth: 1, borderColor: '#f0f0f0',
        width: '100%', height: 200,
        borderRadius: 20,
      }, 
      comment:{
        paddingVertical: 10,
      },
      tagged:{
        color: '#2696b8', fontWeight: '500'
      },
      commentbtn:{
        // borderWidth:1
      },
      commentline:{
       
      },
      commentbuttons:{
        paddingVertical: 10,
        flexDirection: 'row', 
        width: 100,
        justifyContent: 'space-between'
      },
      button:{
        color: '#808080'
      },
      likebtn:{
        position: 'absolute',right: 10,
        
      },
      tbutton:{
        backgroundColor: '#ffff',
        width: 30, height: 30,
        justifyContent: 'center',alignItems: 'center',
      }
});

export default CommentsSnippet;

