import React, { useState, useEffect } from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Courses from "../components/courses";
import { useSelector } from "react-redux";

const Upcoming = () => {
    const defaultProfile = require('../assets/graduate.png')

       //   Set campus and course
   const campus = useSelector(state => state.campus);
   const courseCode = `${campus.faculty}${campus.course}`
   const courseName = Courses[courseCode];
   
    const [profile, setProfile] = useState(defaultProfile);
    const [unit, setUnit] = useState(courseName);
    const [lecturer, setLecturer] = useState('Guest');
    const [time, setTime] = useState('timetable');
    const [topic, setTopic] = useState(courseCode);
    const [events, setEvents] = useState('Attendance, Assessment');
    const [present, setPresent] = useState(defaultProfile);
    const [attending, setAttending] = useState(0);
 
 
    function handleConfirm(){

    }

    return(
        <View style={styles.container}>
            <View style={styles.profileView}>
                 <Image style={styles.profile} source={profile}/>
                 <View style={styles.course}>
                    <Text style={styles.unitname}>{unit}</Text>
                    <Text style={styles.lecturer}>{lecturer}</Text>
                 </View>
            </View>
            <Text style={styles.time}>{time}</Text>
            <View style={styles.lecUpdate}>
                <Text style={styles.topic}>{topic}</Text>
                <Text style={styles.topic}>{events}</Text>
            </View>
            <View style={styles.holder}>
               <View style={styles.classmatesPresent}>
                 <Image style={styles.classmate1} source={present}/>
                 <Image style={styles.classmate2} source={present}/>
                 <Image style={styles.classmate3} source={present}/>
                 <Image style={styles.classmate4} source={present}/>
               </View>
               <Text style={styles.plus}> + {attending}</Text>
            </View>
            <TouchableOpacity style={styles.confirmPresent} onpress={handleConfirm}>
                <Text stle={styles.buttontext}>Present</Text>
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'rgba(38,150,184, 0.5)',
        width: '95%', alignSelf: 'center',
        marginTop: 40, borderRadius: 5,
        padding: 5,
    },
    profileView:{
        flexDirection: 'row',
         width: '50%'
    },
    profile:{
        width: 40, height: 40,
    },
    course:{
        marginLeft: 10
    },
    time:{
        padding: 8, right: 0,
        position: 'absolute', color: 'white'
    }, 
    lecUpdate:{
        padding: 5, 
    },
    topic:{
        marginVertical: 5,color: 'white'
    },
    holder:{
        flexDirection: 'row'
    },
    classmatesPresent:{
        flexDirection: 'row',
      width: 80, alignItems: 'center'
    },
    classmate1: {
        width: 25, height: 25,
        borderWidth: 2, borderColor: 'white', borderRadius: 100,
    },
    classmate2: {
        width: 25, height: 25,
        borderWidth: 2, borderColor: 'white', borderRadius: 100,
        left: -10,
    },
    classmate3: {
        width: 25, height: 25,
        borderWidth: 2, borderColor: 'white', borderRadius: 100,
        left: -20,
    },
    classmate4: {
        width: 25, height: 25,
        borderWidth: 2, borderColor: 'white', borderRadius: 100,
        left: -30,
    },
    confirmPresent:{
        position: 'absolute',
        right: 20, bottom: 10,
         borderRadius: 10,
         backgroundColor:'white',
        paddingHorizontal: 10, paddingVertical: 3,
    }, 
    plus:{
        padding: 5,color: 'white'
    }, 
    unitname:{
       color: 'white'
    },
    lecturer:{
        color: 'white'
     }

});

export default Upcoming;