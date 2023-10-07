import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const TimetableForm = ({ campus, year }) => {
  const [monday, setMonday] = useState([]);
  const [tuesday, setTuesday] = useState([]);
  const [wednesday, setWednesday] = useState([]);
  const [thursday, setThursday] = useState([]);
  const [friday, setFriday] = useState([]);

  useEffect(() => {
    const fetchTimetableData = async () => {
      const timetableRef = doc(
        collection(db, 'campus', campus.id, campus.faculty, 'computer_science', year),
        'timetable'
      );
      const docSnap = await getDoc(timetableRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMonday(data.monday || []);
        setTuesday(data.tuesday || []);
        setWednesday(data.wednesday || []);
        setThursday(data.thursday || []);
        setFriday(data.friday || []);
      }
    };
    fetchTimetableData();
  }, [campus, year]);

  const handleInputChange = (day, index, field, value) => {
    switch (day) {
      case 'monday':
        setMonday(prevData => [
          ...prevData.slice(0, index),
          { ...prevData[index], [field]: value },
          ...prevData.slice(index + 1),
        ]);
        break;
      case 'tuesday':
        setTuesday(prevData => [
          ...prevData.slice(0, index),
          { ...prevData[index], [field]: value },
          ...prevData.slice(index + 1),
        ]);
        break;
      case 'wednesday':
        setWednesday(prevData => [
          ...prevData.slice(0, index),
          { ...prevData[index], [field]: value },
          ...prevData.slice(index + 1),
        ]);
        break;
      case 'thursday':
        setThursday(prevData => [
          ...prevData.slice(0, index),
          { ...prevData[index], [field]: value },
          ...prevData.slice(index + 1),
        ]);
        break;
      case 'friday':
        setFriday(prevData => [
          ...prevData.slice(0, index),
          { ...prevData[index], [field]: value },
          ...prevData.slice(index + 1),
        ]);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    const timetableRef = doc(
      collection(db, 'campus', campus.id, campus.faculty, 'computer_science', year),
      'timetable'
    );
    const timetableData = {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
    };
    await setDoc(timetableRef, timetableData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dayContainer}>
        <Text style={styles.day}>Monday</Text>
        {timetableData.monday.map((classData, index) => (
          <View style={styles.classContainer}>
            <TextInput
              style={styles.input}
              value={classData.time}
              onChangeText={(text) => handleInputChange('monday', index, {...classData, time: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.unit}
              onChangeText={(text) => handleInputChange('monday', index, {...classData, unit: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.lecturer}
              onChangeText={(text) => handleInputChange('monday', index, {...classData, lecturer: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.room}
              onChangeText={(text) => handleInputChange('monday', index, {...classData, room: text})}
            />
          </View>
        ))}
        <Button title="Add Class" onPress={() => handleAddClass('monday')} />
      </View>
      <View style={styles.dayContainer}>
        <Text style={styles.day}>Tuesday</Text>
        {timetableData.tuesday.map((classData, index) => (
          <View style={styles.classContainer}>
            <TextInput
              style={styles.input}
              value={classData.time}
              onChangeText={(text) => handleInputChange('tuesday', index, {...classData, time: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.unit}
              onChangeText={(text) => handleInputChange('tuesday', index, {...classData, unit: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.lecturer}
              onChangeText={(text) => handleInputChange('tuesday', index, {...classData, lecturer: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.room}
              onChangeText={(text) => handleInputChange('tuesday', index, {...classData, room: text})}
            />
          </View>
        ))}
        <Button title="Add Class" onPress={() => handleAddClass('tuesday')} />
      </View>
      <View style={styles.dayContainer}>
        <Text style={styles.day}>Wednesday</Text>
        {timetableData.wednesday.map((classData, index) => (
          <View style={styles.classContainer}>
            <TextInput
              style={styles.input}
              value={classData.time}
              onChangeText={(text) => handleInputChange('wednesday', index, {...classData, time: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.unit}
              onChangeText={(text) => handleInputChange('wednesday', index, {...classData, unit: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.lecturer}
              onChangeText={(text) => handleInputChange('wednesday', index, {...classData, lecturer: text})}
            />
            <TextInput
              style={styles.input}
              value={classData.room}
              onChangeText={(text) => handleInputChange('wednesday', index, {...classData, room: text})}
            />
          </View>
        ))}
        <Button title="Add Class" onPress={() => handleAddClass('wednesday')} />
      </View>
      <View style={styles.dayContainer}>
  <Text style={styles.day}>Thursday</Text>
  <View style={styles.inputContainer}>
    {timetableData.thursday.map((item, index) => (
      <View style={styles.timetableItem} key={index}>
        <TextInput
          style={[styles.input, styles.timeInput]}
          value={item.time}
          placeholder="Time"
          onChangeText={(text) =>
            handleInputChange('thursday', index, { ...item, time: text })
          }
        />
        <TextInput
          style={[styles.input, styles.unitInput]}
          value={item.unit}
          placeholder="Unit"
          onChangeText={(text) =>
            handleInputChange('thursday', index, { ...item, unit: text })
          }
        />
        <TextInput
          style={[styles.input, styles.lecturerInput]}
          value={item.lecturer}
          placeholder="Lecturer"
          onChangeText={(text) =>
            handleInputChange('thursday', index, { ...item, lecturer: text })
          }
        />
        <TextInput
          style={[styles.input, styles.roomInput]}
          value={item.room}
          placeholder="Room"
          onChangeText={(text) =>
            handleInputChange('thursday', index, { ...item, room: text })
          }
        />
      </View>
    ))}
  </View>
</View>
<View style={styles.dayContainer}>
  <Text style={styles.day}>Friday</Text>
  <View style={styles.inputContainer}>
    {timetableData.friday.map((item, index) => (
      <View style={styles.timetableItem} key={index}>
        <TextInput
          style={[styles.input, styles.timeInput]}
          value={item.time}
          placeholder="Time"
          onChangeText={(text) =>
            handleInputChange('friday', index, { ...item, time: text })
          }
        />
        <TextInput
          style={[styles.input, styles.unitInput]}
          value={item.unit}
          placeholder="Unit"
          onChangeText={(text) =>
            handleInputChange('friday', index, { ...item, unit: text })
          }
        />
        <TextInput
          style={[styles.input, styles.lecturerInput]}
          value={item.lecturer}
          placeholder="Lecturer"
          onChangeText={(text) =>
            handleInputChange('friday', index, { ...item, lecturer: text })
          }
        />
        <TextInput
          style={[styles.input, styles.roomInput]}
          value={item.room}
          placeholder="Room"
          onChangeText={(text) =>
            handleInputChange('friday', index, { ...item, room: text })
          }
        />
      </View>
    ))}
  </View>
</View>
</View>
  );
        }

const styles = StyleSheet.create({

})

export default TimetableForm;