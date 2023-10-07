import React, { useEffect, useState} from 'react';
import {View, Stylesheet, Text, Image, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from 'react-router-native';


const myUnits = () =>{
    const navigation = useNavigation();
    const [units, setUnits] = useState('');
    const [unitCount, setUnitCount] = useState(0);

    // Fetch units for student
    // Set year and Student account type
  const currentYear = new Date().getFullYear();
  const semester = useState('one');
  const startYear = campus.yearOfAdmission;
  const userStatus = currentYear > endYear ? "Alumni" : "Active";
  const endYear = Number(startYear) + 4;
  let joined = "";
  if (userProfile.userType === "Student") {
    joined = `Joined: ${startYear} - ${endYear}`;
  } else if (campus.field === "Service") {
    joined = `Joined: ${startYear} to date`;
  }

    return(

    )
}