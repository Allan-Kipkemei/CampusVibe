import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { db } from './firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import Courses from './components/courses';
import MondayScreen from './screens/Monday';
import TuesdayScreen from './screens/Tuesday';
import WednesdayScreen from './screens/Wednesday';
import ThursdayScreen from './screens/Thursday';
import FridayScreen from './screens/Friday';

const Tab = createBottomTabNavigator();


const Timetable = () => {
   const campus = useSelector((state => state.campus))
   const faculty = campus.faculty;
   const course= 'computer_science'     
   const currentYear = new Date().getFullYear();
   const startYear = campus.yearOfAdmission;
   const year = 'year3';
   const [mondayClasses, setMondayClasses] = useState([]);
   const [tuesdayClasses, setTuesdayClasses] = useState([]);
   const [wednesdayClasses, setWednesdayClasses] = useState([]);
   const [thursdayClasses, setThursdayClasses] = useState([]);
   const [fridayClasses, setFridayClasses] = useState([]);
   
   useEffect(() => {
      const fetchTimetable = async () => {
          const timetableRef = doc(db, 'campus', campus.id, faculty, course, year, 'timetable');
          const snapshot = await getDoc(timetableRef);
          const timetableData = snapshot.data();
          
         if (timetableData) {
            const mondayClasses = timetableData.monday || [];
            const tuesdayClasses = timetableData.tuesday || [];
            const wednesdayClasses = timetableData.wednesday || [];
            const thursdayClasses = timetableData.thursday || [];
            const fridayClasses = timetableData.friday || [];
           setMondayClasses(mondayClasses);
           setTuesdayClasses(tuesdayClasses);
           setWednesdayClasses(wednesdayClasses);
           setThursdayClasses(thursdayClasses);
           setFridayClasses(fridayClasses);
          };
       };
   fetchTimetable();
   }, []);
   
  return (
   <Tab.Navigator
     screenOptions={({ route }) => ({
     tabBarLabel: ({ focused }) => {
      let color = focused ? '#2696b8' : '#404040';
      return (
        <Text style={{ fontSize: 12, color: color }}>{route.name}</Text>
      );
    },
    tabBarStyle: {
      backgroundColor: '#fff',
      paddingBottom: 10, height: 60
    },
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === 'Monday') { iconName = '☕️'; } 
      else if (route.name === 'Tuesday') { iconName = '🌮'; }
      else if (route.name === 'Wednesday') { iconName = '🐫'; } 
      else if (route.name === 'Thursday') { iconName = '💪'; }
      else if (route.name === 'Friday') { iconName = '💃'; }
      return <Text style={{ fontSize: size, color: color }}>{iconName}</Text>;
    },
    headerShown: false, 
  })}
>
  <Tab.Screen name="Monday">
    {props => <MondayScreen {...props} mondayClasses={mondayClasses} day={'monday'}/>}
  </Tab.Screen>
  <Tab.Screen name="Tuesday">
    {props => <TuesdayScreen {...props} tuesdayClasses={tuesdayClasses} day={'tuesday'} />}
  </Tab.Screen>
  <Tab.Screen name="Wednesday">
    {props => <WednesdayScreen {...props} wednesdayClasses={wednesdayClasses} day={'wednesday'} />}
  </Tab.Screen>
  <Tab.Screen name="Thursday">
    {props => <ThursdayScreen {...props} thursdayClasses={thursdayClasses} day={'thursday'}/>}
  </Tab.Screen>
  <Tab.Screen name="Friday">
    {props => <FridayScreen {...props} fridayClasses={fridayClasses} day={'friday'} />}
  </Tab.Screen>
</Tab.Navigator>

  );
};

export default Timetable;
