import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet,ProgressBarAndroid, ScrollView, Dimensions } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, app} from '../firebase/firebase.js';
import AttachmentButton from '../components/AttachmentButton.js';
import { useSelector } from 'react-redux';
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5, AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import Courses from "../components/courses";
import UserTaggingTextInput from '../components/TagModal.js';
import { useNavigation } from "@react-navigation/native";
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { debounce } from 'lodash';
import AudiencePicker from '../components/AudiencePicker.js';
import TopicPicker from '../components/TopicPicker.js';
import BackArrow from '../components/Backarrow.js'
import { Avatar, Bubble, Paragraph, IconButton, Colors, Provider } from 'react-native-paper';
import {ProgressBar} from 'react-native-paper'


const {width, height} = Dimensions.get('window')


export default function CreatePost() {
  const navigation = useNavigation();
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [imageTag, setImageTag] = useState('');
  const [topicTag, setTopicTag] = useState('fire');
  const [imageUri, setImageUri] = useState(null);
  const [audience, setAudience] = useState('all');
  const [tagList, setTagList] = useState([]);
  const [textInputKey, setTextInputKey] = useState(0);
  const handleTagListChange = (tags) => {
    setTagList(tags);
  };


  const handleMessageChange =(text) => {
    setMessage(text);
  };
  

  
// Initialize all the userprofile data required for the post
  const defaultProfileImage = require("../assets/graduate.png");
  const defaultField = "Guest";
  const [field, setField] = useState(defaultField);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const userProfile = useSelector((state) => state.userProfile);
  const campus = useSelector(state => state.campus);
  const courseCode = `${campus.faculty}${campus.course}`
  const courseName = Courses[courseCode];
  const userId = userProfile.userId;
  const vibe = campus.id;

  useEffect(() => {
    setField(courseName);
    setProfileImage(
      userProfile.profileImage ? { uri: userProfile.profileImage } : defaultProfileImage
    );
  }, [userProfile]);


  const [selectedColor, setSelectedColor] = useState('orange');
  const icons = [ 
       { icon: 'fire', label: 'Hot' },  { icon: 'search-dollar', label: 'money' },  
       { icon: 'heartbeat', label: 'love' }, 
       { icon: 'book-open', label: 'Education' },  { icon: 'yin-yang', label: 'Life' }, 
        { icon: 'praying-hands', label: 'Prayer' }, 
       { icon: 'hand-holding-heart', label: 'Share Love' }, 
      
      ];
      

//  Handling image passed from attachment button
      const handleImageCapture = (uri) => {
        setImageUri(uri);
      };
      const handleDeleteImage = () => {
        setImageUri(null);
      };

      // Handle posting
      const[isLoading, setLoading] = useState(false);
      const [progress, setProgress] = useState(0);

      useEffect(() => {
        // Simulate loading progress with a timer (replace this with actual loading logic)
        const interval = setInterval(() => {
          setProgress(prevProgress => (prevProgress >= 1 ? 1 : prevProgress + 0.2));
        }, 1000);
    
        // Simulate app initialization
        setTimeout(() => {
          setLoading(false);
          clearInterval(interval);
        }, 5000);
    
        // Clean up interval on unmount
        return () => clearInterval(interval);
      }, []);


      const handlePost = async () => {
        if (!topic || !topicTag || !audience ) {
          alert('Please enter a topic and message.');
          return null;
        }
        
        
        const handleImageUpload = async (imageUri) => {
          setLoading(true);
          const storage = getStorage(app);
          const storageRef = ref(storage, `images/${Date.now()}_${imageUri}`);
          
          // Fetch image data
          const response = await fetch(imageUri);
          const blob = await response.blob();
          
          // Upload image data to Firebase Storage
          const uploadTask = uploadBytes(storageRef, blob);
          await uploadTask;
          // Get the download URL for the uploaded image
          const downloadURL = await getDownloadURL(storageRef);
          setLoading(false)
          return downloadURL;
        };
        
        let downloadURL = '';
        if (imageUri){
        downloadURL = await handleImageUpload(imageUri);
        }
      
        try {
          // Create a new post document in the database
          setLoading(true)
          const postRef = await addDoc(collection(db, 'Posts'), {
            type: 'post',
            userId, //user profile
            audience, vibe, //who to view
            topicTag, topic, message,  //main post
            imageTag, downloadURL, tagList,//Optional attachment
            createdAt: serverTimestamp(),  //timestamp
          });
          setTopic('');
          setMessage('');
          setTagList('');
          setTextInputKey(textInputKey + 1);
          setImageUri(null); 

           console.log('Post created successfully')
           setLoading(false);
           navigation.navigate('BottomTabsRoot', { screen: 'Feed' });
        } catch (error) {
          console.error('Error posting:', error);
          alert('Error posting message. Please try again later.');
        }  
      };  

      const [showAudiencePicker, setShowAudiencePicker] = useState(false);
      const [selectedAudience, setSelectedAudience] = useState('Everyone');
    
      const handleAudienceSelect = (audience) => {
        setSelectedAudience(audience);
        setShowAudiencePicker(false);
      };

      const [selectedTopic, setSelectedTopic] = useState('');

      const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
      };



 return (
    <View style={styles.container}>
       <View style={styles.header}>
         <View style={styles.rowContainer}>
             <Image source={profileImage} style={styles.profileImage} />
             <TouchableOpacity onPress={() => setShowAudiencePicker(true)} style={styles.audiencePickerButton} >   
                 <Text style={styles.audienceLabel}>{selectedAudience}</Text>
             </TouchableOpacity>
           </View>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.close}>
             <AntDesign name="close" size={24} color="white" />
           </TouchableOpacity>

           {isLoading && (
         <View style={styles.loadingOverlay}>
           <ProgressBar progress={progress} color="#2696b8" style={styles.progressBar} />
         </View>
         ) }
       </View>

        <AudiencePicker
           isPickerOpen={showAudiencePicker}
           audience={selectedAudience}
           setAudience={handleAudienceSelect} 
           setPickerOpen={setShowAudiencePicker} 
         />
    {isLoading && (
            <View style={styles.overlay}></View>
          )}
         <ScrollView style={styles.holder}>
           {/* <TopicPicker selectedTopic={selectedTopic} onTopicSelect={handleTopicSelect}/> */}
             <View style={styles.push}>
               <Text style={styles.headline}>Headline...</Text>
               <TextInput
                 style={styles.topicInput}
                 placeholder="What is happening..."
                 onChangeText={setTopic}
                 value={topic}
                 maxLength={60}
                 textAlignVertical='top'
                 padding={5}
               />
             </View>


             <UserTaggingTextInput
                 onTagListChange={handleTagListChange}
                 onMessageChange={handleMessageChange} 
                 id={textInputKey} 
               />

          {imageUri && (
            <View style={styles.display}>
                 <Image source={{ uri: imageUri }} style={styles.attached} />
                 <TextInput
                   style={styles.tag}
                   placeholder="Tag your image"
                   onChangeText={setImageTag}
                   value={imageTag}
                   maxLength={20}
                 />
                 <TouchableOpacity onPress={handleDeleteImage} style={styles.deleteButton}>
                   <FontAwesome5 name="times" size={20} color="#2696b8" />
                 </TouchableOpacity>
             </View>
           )}


           <View style={{paddingVertical: 100}}></View>
       
       </ScrollView>

      {/* Attachment Button and Post Button */}
      <View style={styles.bottom}>
        <AttachmentButton onImageCapture={handleImageCapture} onDeleteImage={handleDeleteImage} />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
             <Text style={styles.postButtonText}>Post</Text>
           </TouchableOpacity>
      </View>

    </View>
  );
}



const styles = StyleSheet.create({
  bottom:{
    position: 'absolute', bottom:0,
    width: width, 
    paddingVertical:10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container:{
    backgroundColor: '#f6f6f6',
    width: width,
     height: '100%'
  },
  header:{
    flexDirection: 'row', paddingVertical: 20,
    alignItems:'center',
    justifyContent: 'space-between',
    paddingHorizontal:10, 
    borderBottomColor: '#f0f0f0', borderBottomWidth:1,
    borderBottomLeftRadius:10, borderBottomRightRadius:10,
    elevation:2,
    backgroundColor: 'white',
    zIndex:11
  },
  postButton:{
    paddingVertical:10, backgroundColor:'#2696b8',
    paddingHorizontal:15, borderRadius:10,
    marginHorizontal:20, marginTop:5
  },
  postButtonText:{
    color: 'white', 
    fontSize:15,
    fontWeight:'500'
  },
  profileImage:{
    width:40, height:40,
    borderRadius:100
  },
  rowContainer:{
    flexDirection:'row',
    alignItems: 'center', paddingHorizontal:15,
    // borderWidth:1
  },
  audiencePickerButton:{
    alignItems: 'center', paddingHorizontal:20,
    paddingVertical:5,
    borderWidth:1.5, borderRadius:10,
    borderColor:'#2696b8', marginHorizontal:20
  },
  audienceLabel:{
    color:'#2696b8'
  },
  close:{
    backgroundColor:'#2696b8', 
    padding:5, borderRadius:100, elevation:2
  },
  message:{
    borderWidth:1,
    padding:5, marginHorizontal:10,
    marginVertical:20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  attached:{
    width:'100%',
    height:200,
    borderRadius:20, borderWidth:1, 
    borderColor:'#e0e0e0'
  },
  deleteButton:{
    position: 'absolute',
    width:30, height:30,
    alignItems:'center', justifyContent:'center',
    backgroundColor:'white',
    borderRadius:1000,margin:10, elevation:2
  },
  display:{
    marginHorizontal:20,
    padding:5,
  },
  cont:{
    width:'90%'
  },
  push:{
    width:'80%',
    padding:5, marginHorizontal:15,
    marginVertical:15,
  },
  headline:{
    fontSize:16, fontWeight: '700',marginVertical:5
  },
  topicInput:{
    // borderBottomColor:'#c0c0c0', 
    
  },
  tag:{
    padding:5, borderWidth:1, 
    borderColor: '#c0c0c0', borderRadius:5
  },
  progressBar:{
    width: '96%', 
    // width:300
    alignSelf: 'center', borderRadius:100
  },
  loadingOverlay:{
    position: 'absolute', bottom:0, left: 0, right:0,

  },
  overlay:{
    backgroundColor: 'rgba(255,255,255,0.5)', 
    top: 0, left:0, right:0, bottom:0,
    position: 'absolute',
    zIndex:10
    }

  
    });
