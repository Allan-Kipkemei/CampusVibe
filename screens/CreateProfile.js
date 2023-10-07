import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, ActivityIndicator} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection} from "firebase/firestore";
import { auth, app} from "../firebase/firebase"; 
import { updatePassword } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import defaultProfileImage from "../assets/graduate.png";
import { useDispatch } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import Courses from "../components/courses";
import BackArrow from "../components/Backarrow";
import { FontAwesome5, Feather} from '@expo/vector-icons';


const CreateProfile = ({ navigation, route}) => {
  // const navigation = useNavigation();
  const { userId, campus, registrationNumber } = route.params;
  const modifiedRegNumber = registrationNumber.replace('/', '-');
  const [faculty, course, studentNumber, yearOfAdmission] = modifiedRegNumber.split('-');
  const campus3 = campus.id.substring(0, 3);  
  const [username, setUsername] = useState(`${campus3}${studentNumber}${yearOfAdmission}`);
  const [about, setAbout] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const courseCode = `${faculty}${course}`.toUpperCase();
  const courseName = Courses[courseCode];
  const dispatch = useDispatch();
  const defaultAbout = `Hey there, Im a student at ${campus.name}`


  // Function to handle saving user profile
  const [isLoading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const handleSaveProfile = async () => {
    if (newPassword && newPassword.length < 8) { alert("New password must be at least 8 characters long");
      return;
    }
    if (newPassword) {
      try {
        setLoading(true)
        await updatePassword(auth.currentUser, newPassword);
        setLoading(false);
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          alert("Session expired! \n Please log in again to update your password.");
          navigation.navigate("Landing",{ campus,});
          return;
        } else {
          console.error("Error updating password:", error);
          alert("Failed to update password. Please try again later.");
          return;  
        } }}
      
    setLoading(true)
    try {
      const db = getFirestore();

      const handleImageUpload = async (profileImage) => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/${Date.now()}_${profileImage}`);
        
        // Fetch image data
        const response = await fetch(profileImage);
        const blob = await response.blob();
        
        // Upload image data to Firebase Storage
        const uploadTask = uploadBytes(storageRef, blob);
        await uploadTask;
        
        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      };
      
      let downloadURL = '';
      if (profileImage){
      downloadURL = await handleImageUpload(profileImage);
      }
      
        try {  
          const userProfileDocRef = doc(db, "userProfiles", userId);
          await setDoc(userProfileDocRef, {
            userId: userId,
            username: username,
            profileImageUrl: downloadURL || defaultProfileImage,
            about: about? about : defaultAbout,
            field: courseName,
            campus: campus.id,
            user: 'student', 
            yearOfAdmission: yearOfAdmission,
          });
      
          console.log("User profile created successfully");
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
         
      
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
  
      try {
        dispatch({
          type: "SET_CAMPUS",
          payload: { campus: campus.name, id: campus.id, faculty,
            course, studentNumber, yearOfAdmission,
          }
          
        });
        console.log("Dispatched campus filter successfully");
      } catch (error) {
        console.error("Error dispatching campus filter:", error);
      }
  
      navigation.navigate("BottomTabsRoot", {
        screen: "Feed",
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
    if (status !== 'granted') {
      console.log('Camera permission denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* <Topnav/> */}
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={styles.header}>
         <View style={styles.post}>
          <BackArrow />
          <Text style={styles.ptext}>Create Profile</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.profileImageContainer} onPress={handleSelectProfileImage}>
        <Image source={profileImage? {uri: profileImage} : defaultProfileImage} style={styles.profileImage}/>
        <MaterialCommunityIcons
           name="camera-plus"
            size={32}
            color="white"
           style={styles.cameraIcon}
          />
      </TouchableOpacity>


      <View style={styles.form}>
        <View style={styles.formGroup}>
        <FontAwesome5 name="user-graduate" size={20} color="#707070" />
        <View style={styles.holder}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Enter your username
            "
          />
           </View>
          </View>

          <View style={styles.formGroup}>
             <Feather name="lock" size={20} color="#707070" />
             <View style={styles.holder}>
               <Text style={styles.input}>Change password (optional)</Text>
               <TextInput
                 style={styles.input}
                 placeholder="New Password"
                 value={newPassword}
                 onChangeText={setNewPassword}
                 secureTextEntry
               />
             </View>
           </View>

           <View style={styles.formGroup}>
             <Feather name="info" size={20} color="#707070" />
             <View style={styles.holder}>
               <Text style={styles.input}>About</Text>
               <TextInput
                 style={styles.input}
                 placeholder={defaultAbout}
                 value={about}
                 onChangeText={setAbout}
                 multiline
                //  numberOfLines={} // Limiting to 5 lines
                 maxLength={120}
                />
              </View>
           </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
            <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
       
      </View>
      {isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)' }}>
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
            profileImageContainer: {
            position: "relative",
            alignSelf: "center",
            marginBottom: 20,
            },
            profileImage: {
            width: 150,
            height: 150,
            borderRadius: 75,
            },
            cameraIcon: {
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: '#2C96B8',
            borderRadius: 20,
            padding: 5,
            },
            form: {
            width: "80%",
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
            picker: {
            borderWidth: 1,
            borderColor: "#DDDDDD",
            borderRadius: 5,
            fontSize: 16,
            color: "#555555",
            },
            button: {
            backgroundColor: "#00BFFF",
            borderRadius: 5,
            padding: 10,
            alignItems: "center",
            // marginTop: 20,
            },
            buttonText: {
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            },
            header: {
              backgroundColor: 'white', 
              width: 393,
              height: 60, position: 'absolute', top: 0,
              zIndex:9
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
            });
            
export default CreateProfile;