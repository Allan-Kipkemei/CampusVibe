import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet} from 'react-native';
import Courses from './courses';
import { useSelector } from 'react-redux';

  // Default user details
  const defaultProfileImage = require("../assets/graduate.png");
  const defaultUsername = "Student";
  const defaultField = "Guest";

const Greeting = () => {
  const date = new Date();
  const hour = date.getHours();
  const userProfile = useSelector((state) => state.userProfile);
  const [username, setUsername] = useState(defaultUsername);
  const [field, setField] = useState(defaultField);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

   //   Set campus and course
   const campus = useSelector(state => state.campus);
   const courseCode = `${campus.faculty}${campus.course}`
   const courseName = Courses[courseCode];

  useEffect(() => {
    setUsername(userProfile.username || defaultUsername);
    setField(courseName);
    setProfileImage(
      userProfile.profileImage ? { uri: userProfile.profileImage } : defaultProfileImage
 );
  }, [userProfile]);

  let greeting;
  if (hour >= 5 && hour < 12) {greeting = 'Good morning'; }
   else if (hour >= 12 && hour < 18) {greeting = 'Good afternoon';}
    else { greeting = 'Good evening'; }
  
  return (
       <View style={styles.container}>
         <View style={styles.greet}>
             <Text style={styles.greeting}>{greeting}, {username}!</Text>
             <Text style={styles.Welcome}>Welcome Back</Text>
          </View>
         <View style={styles.profile}>
            <Image 
               style={styles.profileImage}
               source={profileImage}
            />
            <Text style={styles.semesterTime}>{'Week two'}</Text>
          </View>

        </View>
  );
};


const styles = StyleSheet.create({
    container:{
       justifyContent: 'space-between',
        flexDirection: 'row',
        top: 10,
    }, 
    greeting:{
        color: '#2696b8', fontSize: 16,
    },
    Welcome:{
        fontSize: 18, 
        marginTop: 3
    },
    greet:{
        alignItems: 'center',
        // borderWidth: 1,
        width: '45%', 
        marginLeft: 5, marginTop: 5,
    },
    profileImage:{
        width: 50, 
        height: 50, 
        borderRadius: 100,
        marginBottom: 5
    },
    profile:{
        right: 20,
    }
});

export default Greeting;
