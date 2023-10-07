import { useState, React, useEffect } from "react";
import {View,Text, Image,StyleSheet, TouchableOpacity,Dimensions} from "react-native";
import {  Border, Padding } from "../GlobalStyles";
import { FontAwesome5,AntDesign } from '@expo/vector-icons';
import PostTab from "./LikeTab";
import moment from 'moment';
import ImageView from "../screens/ImageModal";
import ThreeDot from "./3-dotModal";
import VisitUserProfile from "./VisitUserProfile";
import { getFirestore, doc, getDoc, onSnapshot, setDoc, deleteDoc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');


const Snippet = ({ post, postId}) => {
  const [timeAgo, setTimeAgo] = useState("now");
  const words = post.message.split(' ');
  const navigation = useNavigation();
  const [reposted, setReposted] = useState(false)
  
  useEffect(() => {
    if (post.createdAt) {
      const now = moment();
      const postTime = moment(post.createdAt.toDate());
      const diff = moment.duration(now.diff(postTime));
  
      if (diff.asSeconds() < 60) {
        setTimeAgo(`${Math.floor(diff.asSeconds())} seconds ago`);
      } else if (diff.asMinutes() < 60) {
        setTimeAgo(`${Math.floor(diff.asMinutes())} minutes ago`);
      } else if (diff.asHours() < 24) {
        setTimeAgo(`${Math.floor(diff.asHours())} hours ago`);
      } else if (diff.asDays() <= 7) {
        setTimeAgo(`${Math.floor(diff.asDays())} days ago`);
      } else {
        setTimeAgo(postTime.format("DD MMM"));
      }
    }
  }, [post.createdAt]);
 
  

   // Current user details
   const userProfile = useSelector((state => state.userProfile))
   const currentUserId = userProfile.userId;
 
      // Fecth user profile using userId
   const defaultProfileImage = require('../assets/graduate.png');
   const [username, setUsername] = useState('Student');
   const [profileImage, setProfileImage] = useState(null);
   const [field, setField] = useState('Guest');
   const postUserId = post.userId;
 
   useEffect(() => {
     const fetchUserProfile = async () => {
       const db = getFirestore();
       const userRef = doc(db, 'userProfiles', postUserId);
       const userDoc = await getDoc(userRef);
      
       if (userDoc.exists()) {
         const { username, profileImageUrl, field } = userDoc.data();
         setUsername(username)
         setField(field)
         if (profileImageUrl) {
           setProfileImage({ uri: profileImageUrl });
         } 
       }
     };
     fetchUserProfile();
   }, [postUserId]);


  const handlePress = () => {
    const isCurrentUser = currentUserId === postUserId;  
    if(!isCurrentUser){
      navigation.navigate('BottomTabsRoot', {
        screen: 'VisitUserProfile',
        params: { postUserId: postUserId }
      });
    }else{
      navigation.navigate('BottomTabsRoot', {screen: 'Account'})
    }
  };

  const handleTagged = (userId) => {
    const current = currentUserId === userId;
    if(!current){
    navigation.navigate('BottomTabsRoot', {
      screen: 'VisitUserProfile',
      params: { postUserId: userId }
    });
  }else{
    navigation.navigate('BottomTabsRoot', {screen: 'Account'})
  }
  };
  
     // Helper function to fetch creator profile and update the state
     const fetchCreatorProfile = async (userId) => {
      const profileRef = doc(db, 'userProfiles', userId);
      const profileSnapshot = await getDoc(profileRef);
      if (profileSnapshot.exists()) {
        const creatorDetails = profileSnapshot.data();
        setCreatorDetails(creatorDetails);
      } else {
        console.log('User profile not found.');
      }
    };
  
  // Check if Post or repost
  const [creator, setCreatorDetails] = useState('Student')
  if(post.type === 'repost'){
    const userId = post.originalID;
    fetchCreatorProfile(userId);
  }else{

  }



  return (
    <View style={styles.snippet}>
      <ThreeDot  
         postId={post.id} 
         postUserId={post.userId} 
         key={post.id}/>
        <Text style={styles.topic}>
          <FontAwesome5 name={post.topicTag} size={20} color="#FF9900" />
          {' '}{post.topic} 
        </Text>
        
        <TouchableOpacity style={styles.userProfile}  onPress={handlePress} activeOpacity={0.8}>
             <Image 
               style={styles.profileImage} 
               resizeMode="cover"
               source={profileImage || defaultProfileImage}
             />
             <View style={styles.usernameField}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.field}> {field}</Text>
              </View>    
           </TouchableOpacity>

        <View style={styles.messageFlexBox}>
          {post.type === 'repost' && (
            <TouchableOpacity style={styles.reposted}>
               <AntDesign name="retweet" size={18} color="#c0c0c0" />
               <Text style={styles.repostedText}>Reposted from {creator.username}</Text>
            </TouchableOpacity>
          )}
        <Text style={styles.message}>
         {words.map((word, index) => {
         if (word.startsWith('@')) {
           const username = word.substring(1); // Remove the '@' symbol
           const taggedUser = post.tagList.find((user) => user.username === username);
           if (taggedUser) {
           const { userId } = taggedUser;
         return (
          <TouchableOpacity key={index} onPress={() => handleTagged(userId)}>
            <Text style={{ color: '#2696b8', fontWeight: '500' }}>{word}{' '}</Text>
          </TouchableOpacity>
         )}}
         return (
         <Text key={index}>{word}{' '} </Text>
          )})}
       </Text>
     </View>

      <View style={styles.attachment}>
      {post.downloadURL && (
       <View style={styles.attachment}>
       <ImageView
         image={post.downloadURL}
         topicTag = {post.topicTag}
         postId={postId}
         message={post.message}
         topic={post.topic}/>
       {post.imageTag && (
        <Text style={styles.imageTag}>{post.imageTag}</Text>
       )}
      </View>
   )}


     </View>
     <PostTab 
       postId={post.id}
       type={post.type}
       docId={post.postId}
       postUserId={post.userId} 
     />
      <View style={styles.tagcontainer}>
      <Text style={styles.time}>
          {timeAgo}
        </Text>
        {/* <Text style={styles.date}>{post.createdAt ? post.createdAt.toDate().toLocaleDateString() : ''}</Text> */}
        <Text style={styles.vibe}>{post.type === 'repost' ? creator.username : post.vibe} vibes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  snippet: {
    backgroundColor: 'white', 
    paddingHorizontal: 10,
    paddingBottom: 10, marginBottom: 2,
    borderBottomColor: '#f0f0f0', borderBottomWidth: 1,
  },
  topic: {
    fontWeight: "700",
     width: '80%', 
     marginBottom: 10, marginLeft: 5,
    //  borderWidth: 1,
     padding: 2
  },
  time: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: "500", marginLeft: 1,
  },

  messageFlexBox: {
    marginTop: 10,
  },

  message: {
    fontSize: 14, 
  },
  simmu22Icon: {
    borderRadius: Border.br_3xs,
    width: 349,
    height: 158,
  },
  image: {
    padding: Padding.p_8xs,
    marginTop: 5,
  },
  customTopTabChild: {
    display: "none",
  },
  customTopTabItem: {
    marginLeft: 55,
    display: "none",
  },
  customTopTab: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  attachment:{
    paddingTop: 10
  },
  tagcontainer:{
    padding: 10, flexDirection:'row', paddingBottom: 10,
    justifyContent:'space-between', 
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    marginTop: 10,
  },
  vibe:{
    color: '#2696b8', fontSize: 12,
  },
  views:{
    color: '#c0c0c0', fontWeight: '500', 
  },
  date:{
    fontWeight: '500', color: '#c0c0c0'
  }, 
  imageTag:{
    marginLeft: 10, padding: 2, color: '#c0c0c0'
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
    alignItems:'center',
  },
  username:{
    fontWeight: '500',
    marginLeft: 5, marginTop: 5,
  },
  field:{
    color: '#707070', marginLeft: 1,
    marginTop: 5,
  },
  repostedText:{
    color: '#c0c0c0', fontSize:13, marginHorizontal:5
  },
  reposted:{
    flexDirection: 'row',
    marginVertical: 3
  }

});

export default Snippet;
