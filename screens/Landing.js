import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, StatusBar, Image, TextInput, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from '../src/store/store';
import { setUserProfile, setCampusFilter  } from "../src/store/store";
import { auth, db } from "../firebase/firebase";
import { Border, Color } from "../GlobalStyles";
import { ScrollView } from "react-native-gesture-handler";

const Landing = ({ route }) => {
  const navigation = useNavigation();
  const { campus } = route.params;
  const dispatch = useDispatch();
;
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setLoading] = useState(false);
  const modifiedRegNumber = registrationNumber.replace('/', '-');
  const [faculty, course, studentNumber, yearOfAdmission] = modifiedRegNumber.split('-');
  const [disabled, setDisabled] = useState(true)

  const handleLogin = async () => {
    setLoading(true);
    try {
      const email = `${campus.id.replace(/\s/g, "")}.${registrationNumber.replace( "/", "-")}@vibe.com`.toLowerCase();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    

      // User has been successfully logged in.
      // We now try to fetch their user profile from the profile collection in firebase
      const userId = userCredential.user.uid;
      const userProfileDoc = doc(db, "userProfiles", userId);
      const userProfile = await getDoc(userProfileDoc);
  
      if (userProfile.exists()) {
        const userProfileData = userProfile.data();
        const { username, profileImageUrl, field } = userProfileData;

         try {
        dispatch({
          type: "SET_USER_PROFILE",
          payload: {
            username: userProfileData.username, profileImage: userProfileData.profileImageUrl,
            about: userProfileData.about, userId, 
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
      } else {
        // User with no profile in the collection
        navigation.navigate("CreateProfile",{
          userId,
          campus, 
          registrationNumber
        }

        );
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Incorrect registration number or password. Please try again.");
    }
    setLoading(false);
  };

  const [isTyping, setIsTyping] = useState(false);

  const handleFocus = () => {
    setIsTyping(true);
  };

  const handleBlur = () => {
    setIsTyping(false);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.landing}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>

     {/* Form..................................................... */}
     <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
     <Image style={styles.vibeIcon} resizeMode="cover" source={require("../assets/graduate.png")}/>
      <View style={styles.university}>
        <Image source={require('../assets/camp.png')} style={styles.camp}/>
      </View>
       {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        <View style={styles.registrationNumberWrapper}>
        <TextInput
            style={styles.inputbox}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Registration number"
            onChangeText={(text) => {
              setRegistrationNumber(text.toUpperCase())
              setDisabled(false);
            }}
            theme={{
                fonts: { regular: { fontFamily: "", fontWeight: "Regular" } },
                colors: { text: "#000" },
               }}
           />

       </View>
       <View style={styles.password}>
        <TextInput
        style={styles.inputbox}
          placeholder="Password"
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword(text);
            setDisabled(false);
          }}          
          theme={{
            fonts: { regular: { fontFamily: "", fontWeight: "Regular" } },
            colors: { text: "#000" },
          }}
        />
        </View>
         <Pressable style={styles.registration} onPress={handleLogin} disabled={disabled}>
           <Text style={styles.continue}>Continue</Text>
         </Pressable>
      </KeyboardAvoidingView>
      {isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <ActivityIndicator size={30} color="#2696b8" />
        </View>
      )}

   
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mmuHotel21Layout: {
    width: 120,
    left: 0,
  },
  error:{
    fontSize: 15, fontWeight: 600, 
    color: 'red',
  },
  camp:{
    width: 200, height: 100
  }, 
  okbtn:{
    padding: 20,
    color: 'white'
  },
  inputbox: {
    backgroundColor: '#f8f8f8',
    padding: 15,
  },
  iconLayout: {
    width: 120,
    left: 131,
  },
  iconPosition: {
    left: 258,
    width: 125,
    position: "absolute",
  },
  whatsappPosition: {
    borderTopRightRadius: Border.br_mini,
    position: "absolute",
  },
  mmuHotel21: {
    height: 180,
    borderBottomRightRadius: Border.br_mini,
    position: "absolute",
    top: 0,
  },
  swimmu1Icon: {
    height: 90,
    borderBottomLeftRadius: Border.br_mini,
    top: 0,
    borderBottomRightRadius: Border.br_mini,
    position: "absolute",
  },
  mmu11Icon: {
    top: 100,
    borderRadius: Border.br_mini,
    height: 180,
    position: "absolute",
  },
  mmustud1Icon: {
    borderBottomLeftRadius: Border.br_mini,
    top: 0,
    height: 180,
  },
  mmuhotel1Icon: {
    top: 190,
    height: 180,
    borderTopLeftRadius: Border.br_mini,
  },
  whatsappImage20230119At9: {
    top: 190,
    height: 180,
    width: 110,
    left: 10,
  },
  whatsappImage20230119At91: {
    top: 291,
    height: 80,
    borderTopLeftRadius: Border.br_mini,
    width: 120,
    left: 131,
  },
  beautifulSplash: {
    alignSelf:'center',
    width: 383, 
    height: 340, position:'relative', 
  },
  registrationNumberWrapper: {
    width: 300,
    backgroundColor: '#f8f8f8',
    borderRadius: 20, marginTop: 20,
  },
  password: {
    marginTop: 20, 
    width: 300,
  },
  continue: {
    textAlign: "left",
    fontWeight: "700", color: 'white',
  },
  registration: {
    backgroundColor: Color.steelblue_200,
    paddingHorizontal: 120, paddingVertical: 15,
    alignItems: "center",
    borderRadius: 20, marginTop: 20,
  },
  vibeIcon: {
   width: 80, height: 80, alignSelf: 'center', 
   borderWidth: 1, 
    // borderColor: '#2C96B8', 
   borderRadius:100,
  },
  whichcampus: {
    fontSize: 30, 
    color: 'black', fontWeight: 600,
    width: 179,
    height: 65,
    textAlign: "center",
  },
  university: {
    alignSelf: 'center',
    justifyContent: "flex-end",
  },
  landing: {
    backgroundColor: Color.white,  flexGrow: 1,
    paddingBottom: 20,
    maxHeight: '100%',
    overflow: 'hidden',
    width: "100%",
    height: 822,
    overflow: "hidden",
    alignItems: 'center', justifyContent: 'center'
  },
  keyboard:{
    alignItems: 'center', 
    
   
  }
});

export default Landing;