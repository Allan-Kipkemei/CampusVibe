import { useState, React, useEffect } from "react";
import {
  View,
  Text, Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {  Border, Padding } from "../GlobalStyles";
import { FontAwesome5 } from '@expo/vector-icons';
import PostTab from "./LikeTab";
import moment from 'moment';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import ImageView from "../screens/ImageModal";



const AccountSnippet = ({ post, postId}) => {
  const navigation = useNavigation();
  const [timeAgo, setTimeAgo] = useState("1s");
  const [date, setDate] = useState(null);
   
  useEffect(() => {
    if (post.createdAt) {
      const now = moment();
      const postTime = moment(post.createdAt.toDate());
      const diff = moment.duration(now.diff(postTime));
      if (diff.asSeconds() < 60) {
        setTimeAgo(`${Math.floor(diff.asSeconds())}s`);
      } else if (diff.asMinutes() < 60) {
        setTimeAgo(`${Math.floor(diff.asMinutes())}m`);
      } else if (diff.asHours() < 24) {
        setTimeAgo(`${Math.floor(diff.asHours())}h`);
      } else {
        setTimeAgo(`${Math.floor(diff.asDays())}d`);
      }
      setDate(postTime.format("MMMM DD YYYY"));
    }
  }, [post.createdAt]);
 
  // Fecth user profile using userId
  const defaultProfileImage = require('../assets/graduate.png');
  const [username, setUsername] = useState('Student');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const userRef = doc(db, 'userProfiles', post.userId);
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
  }, [post.userId]);

 


  return (
    <View style={styles.snippet}>
      <View style={styles.topicTime}>
        <Text style={styles.topic}>
          <FontAwesome5 name={post.topicTag} size={20} color="#FF9900" />
            {post.topic} 
        </Text>
        <Text style={styles.time}>
          {timeAgo}
        </Text>
      </View>

      <View style={styles.userProfile}>
        <Image 
          style={styles.profileImage} 
          resizeMode="cover"
          source={profileImage || defaultProfileImage}
          />
        <View style={styles.usernameField}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.field}> {post.field}</Text>
        </View>    
       </View>

       <TouchableOpacity>
        <View style={styles.messageFlexBox}>
          <Text style={styles.message} >
            {post.message}
          </Text>
        </View>
      </TouchableOpacity>
     

      <View style={styles.attachment}>
      {post.imageUri ? (
  <View style={styles.attachment}>
    <ImageView
        image={post.imageUri}
        topicTag = {post.topicTag}
        postId={postId}
        message={post.message}
        topic={post.topic}/>
    {post.imageTag ? (
      <Text style={styles.imageTag}>{post.imageTag}</Text>
    ) : null}
  </View>
) : null}


     </View>
     <PostTab 
        post
       key={post.id}
       postId={post.id}
     />
      <View style={styles.tagcontainer}>
        <Text style={styles.views}>
          Views {'200'}
        </Text>
        <Text style={styles.date}>{post.createdAt ? post.createdAt.toDate().toLocaleDateString() : ''}</Text>
        <Text style={styles.vibe}>{post.vibe} vibes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  snippet: {
    // backgroundColor: 'white',
    padding: 10, paddingBottom: 10, marginBottom: 3,
    borderBottomColor: '#f0f0f0', borderBottomWidth: 1,
  },
  topicTime: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    marginBottom: 10, marginLeft: 5, top: 0,
  },
  topic: {
    fontSize: 15,
    fontWeight: "500",
     width: '85%', 
  },
  time: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: "500", marginLeft: 20,
  },
  username:{
    fontWeight: '500',
    marginLeft: 5, marginTop: 5,
  },
  field:{
    color: '#404040', marginLeft: 1,
    marginTop: 5,
  },
  usernameField:{
    alignItems: 'center',
    
  },

  messageFlexBox: {
    marginTop: 10,
  },
  profileImage: {
    borderRadius: 100,
    width: 45,
    height: 45,
  },
  usernameField: {
    marginLeft: 6,
  },
  userProfile: {
    marginTop: 5,marginLeft: 5,
    flexDirection: 'row',
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
    color: '#2696b8', fontWeight: '500'
  },
  views:{
    color: '#c0c0c0', fontWeight: '500', 
  },
  date:{
    fontWeight: '500', color: '#c0c0c0'
  }, 
  imageTag:{
    marginLeft: 10, padding: 2, color: '#c0c0c0'
  }

});

export default AccountSnippet;
