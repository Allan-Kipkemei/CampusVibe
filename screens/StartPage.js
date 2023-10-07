import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar, Button} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/firebase';

  const Start = () => {
    const navigation = useNavigation();
    const [campuses, setCampuses] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState('');
  
    const [error, setError] = useState(null);

    useEffect(() => {
      const campusRef = collection(db, 'campus');
      const unsubscribe = onSnapshot(
        campusRef,
        (querySnapshot) => {
          const campuses = [];
          querySnapshot.forEach((doc) => {
            const { name } = doc.data();
            campuses.push({
              id: doc.id,
              name,
            });
          });
          setCampuses(campuses);
          setError(null); // Clear the error if successful
        },
        (error) => {
          setError(error);
        }
      );
      return unsubscribe;
    }, []);
    
    // Conditional rendering for NetworkError
    if (error) {
      return <NetworkError message={error} />;
    }
 
  
    const handleCampusChange = (campus) => {
      setSelectedCampus(campus);
    };
  
    const handleContinue = () => {
      if (selectedCampus) {
        const campus = campuses.find((c) => c.name === selectedCampus);
        navigation.navigate('Landing', { campus });
      } else {
        alert('Please select a campus');
      }
    };
  
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'white'} barStyle={'light-content'}/>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/graduate.png')} style={styles.logo} />
        </View>
        <View style={styles.selectCampusContainer}>
          <Text style={styles.selectCampusText}>Select Your College/Campus</Text>
          <View style={styles.selectCampusDropdown}>
            <Picker
              selectedValue={selectedCampus}
              onValueChange={handleCampusChange}
            >
              <Picker.Item label="Select campus" value="" />
              {campuses.map((campus) => (
                <Picker.Item key={campus.id} label={campus.name} value={campus.name} />
              ))}
            </Picker>
          </View>
        </View>
        <TouchableOpacity style={[styles.continueButton, !selectedCampus && 
          { opacity: 0.5, borderWidth: 1, borderColor: '#c0c0c0'}]} 
          onPress={handleContinue} disabled={!selectedCampus}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbar:{
    position: 'absolute', top: 0, left: 0, flex: 1, 
    backgroundColor: 'white', padding: 15, width: '100%',
    borderBottomColor: '#f0f0f0', borderBottomWidth: 1, 
  },
  campusheader:{
    marginLeft: 10,
    fontSize: 20, fontFamily: 'RubikPixels-Regular',
    fontWeight: 700, 
  },
  vibeicon:{
    width: 20, height: 20, marginRight: 10,
  },
  logoContainer: {
    marginBottom: 100,
  },
  logo: {
    width: 100,
    height: 100,
  },
  selectCampusContainer: {
    marginBottom: 30, width: '80%', height: 100,
  },
  selectCampusText: {
    fontSize: 17, alignSelf: 'center',
    marginBottom: 10,
  },
  selectCampusDropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  continueButton: {
    backgroundColor: '#2696b8', borderRadius: 30,
    paddingHorizontal: 100,
    paddingVertical: 15,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Start;
