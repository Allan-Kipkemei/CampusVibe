import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Feather, Ionicons, FontAwesome5} from '@expo/vector-icons';
import TimetableTop from '../components/TtTop';
import { useState, useEffect } from 'react';


const ThursdayScreen = ({thursdayClasses}) => {
  const [loading, setLoading] = useState(true);
  const [classDetails, setClassDetails] = useState([]);
  const [period, setPeriod] = useState('2hr');

  useEffect(() => {
    setClassDetails(thursdayClasses);
    setTimeout(() => setLoading(false), 3000);
  }, []);

    const renderClassDetails = (time, unit, room, lecturer) => {
    return (
        <View style={styles.detailsContainer}>
             <View style={styles.iconContainer}>
                  {time === 'morning' && (<Text style={styles.emoji}> 🌅</Text>)}
                  {time === 'midmorning' && (<Text style={styles.emoji}> ☀️</Text>)}
                  {time === 'afternoon' &&(<Text style={styles.emoji}> 🌇</Text>)}
                  {time === 'evening' && (<Text style={styles.emoji}> 🌙</Text>)}
               </View>
               <Text style={styles.time}>{period}</Text>
             <Text style={styles.unitText}>{unit}</Text>
             <Text style={styles.roomText}>{room}</Text>
          <View style={styles.lecturerContainer}>
              {/* <Image source={lecturer.icon} style={styles.lecturerIcon} /> */}
             <Text style={styles.lecturerText}>{lecturer}</Text>
          </View>
        </View>
  
    );
  };
 
  const renderedTimeSlots = classDetails.map((details) => details.time);
  const availableTimeSlots = ['morning', 'midmorning', 'afternoon', 'evening'].filter(slot => !renderedTimeSlots.includes(slot));
  const [inputValues, setInputValues] = useState({});
  const renderCustomActivity = (activity, time) => {
    const uniqueKey = `activity-${activity}`;
    return (
      <View key={activity} style={styles.detailsContainer}>
         <View style={styles.iconContainer}>
                  {time === 'morning' && (<Text style={styles.emoji}> 🌅</Text>)}
                  {time === 'midmorning' && (<Text style={styles.emoji}> ☀️</Text>)}
                  {time === 'afternoon' &&(<Text style={styles.emoji}> 🌇</Text>)}
                  {time === 'evening' && (<Text style={styles.emoji}> 🌙</Text>)}
               </View>
        <TextInput
          value={inputValues[uniqueKey]}
          placeholder='Schedule your own extra work e.g Assignments'
          style={styles.textinput}
          onChangeText={(text) => {
            setInputValues({
              ...inputValues,[uniqueKey]: text,
            });
          }}
        />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <TimetableTop />
      {classDetails.length > 0 ? (classDetails.map((details, index) =>
      renderClassDetails(
         details.time,  details.unit,  details.room, details.lecturer
       )
    )
    ) : (
        <View style={styles.free}>
          {loading && <ActivityIndicator size="small" color="white" />}
          <Text style={styles.freetext}>Your free today!  </Text>
          <Feather name="check-circle" size={20} color="white" />
        </View>
        )}

       {availableTimeSlots.map((time, index) =>
          renderCustomActivity(`Custom Activity ${index + 1}`, time)
        )}

    </View>
  );
      }

const styles = StyleSheet.create({
    time:{
        position:'absolute', right: 10, top: 10,
        fontSize: 13, color: '#a0a0a0'
    }, 
  iconContainer: {
   position:'absolute', left: 15, top: 15,
   backgroundColor: '#f8f8f8', borderRadius: 100, padding: 5, alignItems:'center'
  },
  emoji:{
    fontSize: 18
  },
  detailsContainer: {
   borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 20,
   backgroundColor: 'white',
   padding: 20, 
   marginTop:5,
   width: '95%', alignSelf: 'center',
   height: 100, alignItems: 'center', justifyContent: 'center'
  },
  unitText: {
   fontSize: 16, fontWeight: '500',
   alignSelf: 'center'
  },
  roomText: {
    bottom: 10, position: 'absolute', right: 10,
    fontSize: 13, color: '#a0a0a0'
  },
  lecturerContainer: {
   position: 'absolute', alignSelf:'center',
 bottom: 10,
  },
  lecturerIcon: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginRight: 10,
  },
  lecturerText: {
   color: '#2696b8'
  },
  free:{
    paddingVertical: 10, alignItems: 'center',  flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: "rgba(38,150,184,0.4)", width: '95%', alignSelf: 'center', marginTop:5,
     borderRadius:10,
  },
  freetext:{
    fontSize: 16, fontWeight: '500', color: 'white', alignSelf: 'center'
  }
});

export default ThursdayScreen;
