import React, {useState, useEffect} from "react";
import {View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Topnav from "./Topnav";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";

const CreateTimetable = () =>{
   const campus = useSelector(state => state.campus);
   const [department, setDepartment] = useState('');
   const [course, setCourse] = useState('');
   const [day, setDay] = useState('');
   const [time, setTime] = useState('');
   const[unit, setUnit] = useState('');
   const [selections, setSelections] = useState([]);
   const [units, setUnits] = useState([]);
    // const units = [
    //     {code:'', name: 'Select Unit'},{ code:'CSC101', name:'Introduction to Computer Science' }, 
    //                { code: 'MTH101', name: 'Calculus I' },
    //               ];
    const handleSave = async () => {
        const timetableRef = doc(collection(db, "campus", campus), "timetable");
        const departmentRef = doc(collection(db, "campus", campus, "timetable", department), "courses", course);
    
        try {
          const docSnap = await getDoc(departmentRef);
          const data = docSnap.data();
    
          if (docSnap.exists()) {
            // Update existing course document with new data
            await setDoc(departmentRef, {
              ...data,
              [day]: [
                ...data[day],
                {
                  time: time,
                  unit: unit,
                  room: room,
                  lecture: lecture,
                },
              ],
            });
          } else {
            // Create new course document with provided data
            await setDoc(departmentRef, {
              [day]: [
                {
                  time: time,
                  unit: unit,
                  room: room,
                  lecture: lecture,
                },
              ],
            });
          }
          console.log("Document written successfully!");
        } catch (e) {
          console.error("Error writing document: ", e);
        }
      };

    useEffect(() => {
      // Set the unit value to null whenever the time value changes
       setUnit('');
    }, [time]);

    // Selections and rendering the selections
    const handleAddSelection = () => {
        if (department !== '' && course !== '' && day !== '' && time !== '' && unit !== '') {
          setSelections(prevSelections => {
            const newSelections = {...prevSelections};
            if (!newSelections[department]) {
              newSelections[department] = {[course]: [{day, time, unit}]};
            } else if (!newSelections[department][course]) {
              newSelections[department][course] = [{day, time, unit}];
            } else {
              let selectionUpdated = false;
              newSelections[department][course] = newSelections[department][course].map(selection => {
                if (selection.day === day && selection.time === time) {
                  selection.unit = unit;
                  selectionUpdated = true;
                }
                return selection;
              });
              if (!selectionUpdated) {
                newSelections[department][course].push({day, time, unit});
              }
            }
            return newSelections;
          });
          setTime('');
          setUnit('');
        } else {
          alert('Cannot be blank');
        }
      };
      
      collection(db, 'campus', campus, department, course, year, resource)
      
      const sortedSelectionsByDayAndTime = {};
            for (const department in selections) {
                if (!selections.hasOwnProperty(department)) continue;
                   sortedSelectionsByDayAndTime[department] = {};
                    for (const course in selections[department]) {
                        if (!selections[department].hasOwnProperty(course)) continue;
                             sortedSelectionsByDayAndTime[department][course] = selections[department][course].sort((a, b) => {
         const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday"];
         const dayIndexA = dayOrder.indexOf(a.day);
         const dayIndexB = dayOrder.indexOf(b.day);
          if (dayIndexA !== dayIndexB) {
               return dayIndexA - dayIndexB;
         } else {
             const timeOrder = ["morning", "mid_morning", "afternoon"];
             const timeIndexA = timeOrder.indexOf(a.time);
             const timeIndexB = timeOrder.indexOf(b.time);
           return timeIndexA - timeIndexB;
          }
       });
      }
    }
         const handleClearSelection = () =>{
            setSelections([]);
         }

    return(
        <View>
        <Topnav/>
        <FlatList
           data={[{ key: 'Timetable' }]}
           contentContainerStyle={styles.container}
            renderItem={() => (
            <View style={styles.body}>
                 <View style={styles.picker}>
                 <Picker selectedValue={department} onValueChange={setDepartment} >
                     <Picker.Item label="Select Department" value="" />
                     <Picker.Item label="CIT" value="cit" />
                     <Picker.Item label="MCS" value="mcs" />
                     {/* Add more departments here */}
                 </Picker>
                 </View>
                 {department !== '' && (
                     <View style={styles.picker}>
                     <Picker selectedValue={course} onValueChange={setCourse} >
                          <Picker.Item label="Select Course" value="" />
                         <Picker.Item label="Computer Science" value="computer_science" />
                         <Picker.Item label="Software Engineering" value="software_engineering" />
                         {/* Add more courses here */}
                     </Picker>
                     </View>
                   ) }
                      {course !== '' && (
                     <View style={styles.picker}>
                    <Picker selectedValue={day} onValueChange={setDay} >
                          <Picker.Item label="Select day" value="" />
                         <Picker.Item label="Monday" value="monday" />
                         <Picker.Item label="Tuesday" value="tuesday" />
                         <Picker.Item label="Wednesday" value="wednesday" />
                         <Picker.Item label="Thursday" value="thursday" />
                         <Picker.Item label="Friday" value="friday" />            
                     </Picker>
                     </View>
                   ) }
                  {day !== '' && (
                  <View>
                      <View style={styles.unit}>
                          <View style={styles.selectUnit}>
                             <Picker selectedValue={time} onValueChange={setTime}>
                                 <Picker.Item label="Select time" value="" />
                                 <Picker.Item label="Morning(8:00AM - 10:00AM)" value="morning" />
                                 <Picker.Item label="Mid-morning(10:00AM - 12:00AM)" value="mid_morning" />
                                 <Picker.Item label="Afternoon(2:00PM - 4:00PM)" value="afternoon" />
                               </Picker>
                           </View>
                           <View style={styles.selectUnit}>
                                  <Picker selectedValue={unit} onValueChange={setUnit}>
                                    {units.map((unit) => (
                                      <Picker.Item key={unit.code} label={`${unit.code} - ${unit.name}`} value={unit.code + ' : ' + unit.name} />
                                     ))}
                                   </Picker>
                              </View>
                       </View>

                      <View style={styles.buttons}>
                        <TouchableOpacity onPress={handleAddSelection} style={styles.button}>
                            <Text style={styles.buttonText}>Add Selection</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClearSelection} style={styles.button}>
                            <Text style={styles.buttonText}>Clear</Text>
                        </TouchableOpacity>
                      </View>

                      {Object.entries(selections).map(([department, courses]) => (
                      <View key={department} style={styles.holder}>
                         <View style={styles.department}>
                            <Text style={styles.deptext}>{department}</Text>
                         </View>
                         {Object.entries(courses).map(([course, selections]) => (
                         <View key={course}>
                             <Text style={styles.course}>{course}</Text>
                             {selections.map((selection, index) => (
                             <View key={index} style={styles.tbody}>
                                 <Text style={styles.day}>{selection.day}</Text>
                                 <View style={styles.unitTime}>
                                     <Text style={styles.time}>{selection.time}</Text>
                                     <Text style={styles.tUnit}>{selection.unit}</Text>
                                   </View>
                               </View>
                             ))}
                          </View>
                          ))}
                       </View>
                        ))}
                        <TouchableOpacity onPress={handleSave} style={styles.button}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                   </View>
                   )}
              </View>
          )}
          />
          </View>
        )
   };

const styles = StyleSheet.create({
    container:{
        paddingBottom: 100,
    },
    body:{
        // borderWidth: 1
    },
    picker:{
        borderWidth: 1, borderRadius: 10, borderColor: '#c0c0c0',
        width: '95%', alignSelf: 'center',
        marginVertical: 20,
    },
    unit:{
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    selectUnit:{
        width:'45%', marginVertical: 20,
        borderWidth: 1, borderRadius: 10, borderColor: '#c0c0c0'
    },  
    buttons:{
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 20,
    },
    button:{
        backgroundColor: '#2696b8',
        width: 130, height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5, marginHorizontal: 20
    },
    buttonText:{
        color: 'white',
    },
    holder:{
        marginVertical: 5,
        padding: 10, 
        backgroundColor: '#ffff',
        width: '95%', alignSelf: 'center',
        borderRadius: 10, borderWidth: 1, borderColor: '#c0c0c0',
    },
    department:{
       alignItems: 'center',
    }, 
    deptext:{
        fontWeight: '500', fontSize: 18, 
    },
    course:{
        fontSize: 16,fontWeight:'500',
        borderWidth: 1,
        borderColor: '#c0c0c0',
        padding: 5,
        marginTop: 10,
    },
    tbody:{
        flexDirection: 'row',
        borderWidth: 1, marginVertical: 1,
        borderColor: '#c0c0c0',
    },
    unitTime:{
        marginLeft: 5
    },
    day:{
        width: 60,
        fontWeight: '500',
        alignSelf: "center"
    },
    time:{
        fontWeight: '500',
        padding: 5,
        margin: 1,
         width: '100%'
    },
    tUnit:{
        padding: 5,
        margin: 1, width: '100%'
    }
})


export default CreateTimetable;