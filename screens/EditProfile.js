import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, ActivityIndicator, Modal} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection} from "firebase/firestore";
import { auth, app } from "../firebase/firebase"; 
import { updatePassword } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import BackArrow from "../components/Backarrow";
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import ProfileEditSheet from "../components/ProfileEditSheet";
import { FontAwesome5, Feather} from '@expo/vector-icons';
import NetworkError from "../components/NetworkError";



const EditProfile = () => {
  const navigation = useNavigation();
  const defaultProfileImage = require('../assets/graduate.png')
  const userProfile = useSelector((state => state.userProfile))
  const userImage =userProfile.profileImage
  const [username, setUsername] = useState(userProfile.username);
  const [newUsername, setNewUserName] = useState('');
  const [about, setAbout] = useState(userProfile.about);
  const [newAbout, setNewAbout] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(typeof userImage === 'string' ? userImage : null);
  const [newProfileImage, setNewImage] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const dispatch = useDispatch();
  const userId = useSelector((state => state.userProfile.userId))
  const [errorMessage, setNetworkError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch exisiting details
  try{
  useEffect(() => {
    const fetchUser = async () => {
      const db = getFirestore();
      const userProfileDocRef = doc(db, "userProfiles", userId);
      const userProfileDataSnapshot = await getDoc(userProfileDocRef);
      const userProfileData = userProfileDataSnapshot.data();
      setUsername(userProfileData.username);
      setProfileImageUrl(userProfileData.profileImageUrl);
      setAbout(userProfileData.about);
    };
    fetchUser();
  }, [userId]);
}catch{
  const errorMessage = 'No internet Connection!'
  setNetworkError(errorMessage)
}

  // Function to handle saving user profile
  const [isLoading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const db = getFirestore();

      const handleImageUpload = async (newProfileImage) => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/profileImages/${Date.now()}_${newProfileImage}`);
        
        // Fetch image data
        const response = await fetch(newProfileImage);
        const blob = await response.blob();
        
        // Upload image data to Firebase Storage
        const uploadTask = uploadBytes(storageRef, blob);
        await uploadTask;
        
        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      };
      
      let downloadURL = '';
      if (newProfileImage){
      downloadURL = await handleImageUpload(newProfileImage);
      }

        try {  
          const db = getFirestore();
          const userProfileDocRef = doc(db, "userProfiles", userId);
          const userProfileData = {
            username: newUsername || username,
            profileImageUrl: downloadURL || profileImageUrl,
            about: newAbout || about
          };
          await updateDoc(userProfileDocRef, userProfileData);
        } catch (error) {
          console.error("Error updating user profile: ", error);
        }
        setLoading(false);
         
      
      const userProfileDocRef = doc(db, "userProfiles", userId);
      const newProfileSnapshot = await getDoc(userProfileDocRef);
      const newProfileData = newProfileSnapshot.data();
      try {
        dispatch({
          type: "SET_USER_PROFILE",
          payload: {
            username: newProfileData.username,profileImage: newProfileData.profileImageUrl,
            about: newProfileData.about, userId, 
          },
        });    
      } catch (error) {
        console.error("Error dispatching user profile:", error);
      }
      navigation.navigate("BottomTabsRoot", {
        screen: "Account",
      });
  
    } catch (error) {
      console.log(error)
      alert('Failed!')
      ;
    }
    setLoading(false);
  };
  
  

  // Function to handle selecting a profile image
  const handleSelectProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.uri);
      setModalVisible(false)
      setDisabled(false)
    }
  };

  const handleCaptureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Camera permission denied');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.uri);
      setModalVisible(false)
      setDisabled(false)
    }
  };
  const handleProfileRemove = () =>{
    setNewImage(null)
    setProfileImageUrl(null)
    setDisabled(false)
    setModalVisible(false)
  }
  
  return (
    <View style={styles.container}>
      {/* <Topnav/> */}
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={styles.header}>
         <View style={styles.post}>
          <BackArrow />
          <Text style={styles.ptext}>Edit Profile</Text>
        </View>
      </View>
      {errorMessage && <NetworkError message={errorMessage} />}


      <ProfileEditSheet
       profileImageUrl={profileImageUrl} 
       newProfileImage={newProfileImage}
        defaultProfileImage={defaultProfileImage}
        selectImage={handleSelectProfileImage}
        removeImage={handleProfileRemove}
        captureImage={handleCaptureImage}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
       />

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <FontAwesome5 name="user-graduate" size={20} color="#707070" />
          <View style={styles.holder}>
             <Text style={styles.input}>Username</Text>
             <TextInput
               style={styles.name}
               onChangeText={(text) => {
                setNewUserName(text);
                setDisabled(false);
               }}
               value={newUsername}
               placeholder={username}
             />
            </View>
            <Feather name="edit-3" size={20} color="#707070" style={styles.icon}/>
          </View>
  
           <View style={styles.formGroup}>
             <Feather name="info" size={20} color="#707070" />
             <View style={styles.holder}>
               <Text style={styles.input}>About</Text>
               <TextInput
                 style={styles.name}
                 placeholder={about}
                 value={newAbout}
                 onChangeText={(text) => {
                  setNewAbout(text);
                  setDisabled(false);
                 }}
                 multiline
                 maxLength={120}
               />
             </View>
             <Feather name="edit-3" size={20} color="#707070" style={styles.icon}/>
           </View>


        <TouchableOpacity style={styles.button} onPress={handleSaveProfile} disabled={disabled}>
            <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
       
      </View>
      {isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator />
        </View>
      )}
    </View>
   );
 };
            
const styles = StyleSheet.create({
    container: {
       flex: 1,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
      },
      header: {
        backgroundColor: 'white', 
        width: 393,
        height: 60, position: 'absolute', top: 0, zIndex:9
      },
      post:{
        marginLeft: 30,
        marginTop: 20,
        flexDirection: 'row',
    
      },
      ptext:{
        fontSize: 18,
        fontWeight: 600,
        marginLeft: 20,
      },
          
            form: {
            width: "80%",
            // borderWidth:1,
            },
            formGroup: {
            marginBottom: 20,
            flexDirection:'row',
            alignItems:'center',
            marginVertical:10
            // justifyContent:'space-between'
            },
            holder:{
              marginLeft:20, marginRight:100
            },
            label: {
            fontSize: 16,
            marginBottom: 5,
            color: "#444444",
            },
            input: {
            color: "#707070",
            },
            name:{
              fontSize:15,
            },
            icon:{
              position:'absolute',
              right:20,
            },
            picker: {
            borderWidth: 1,
            borderColor: "#DDDDDD",
            borderRadius: 5,
            fontSize: 16,
            color: "#555555",
            },
            button: {
            backgroundColor: "#00BFFF",
            alignItems: 'center', paddingVertical: 10,
            borderRadius: 10
            },
            buttonText: {
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            },
            });
            
export default EditProfile;