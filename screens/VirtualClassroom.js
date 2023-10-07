import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Topnav from "../components/Topnav";
import Greeting from "../components/VirtualClass-welcome";
import Current from "../components/VirtualClassroom-current";
import { useNavigation } from "@react-navigation/native";


const VirtualClassroom = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.virtualClassroom}>
        <Topnav/>
        <View style={styles.body}>
             <Greeting/>
             <Current/>
             <TouchableOpacity onPress={() => navigation.navigate("Timetable")} style={styles.button}>
                 <Text style={styles.timetable}>Timetable</Text>
              </TouchableOpacity>
         </View>
    </View>
  );
};

const styles = StyleSheet.create({
  virtualClassroom:{
   height: '100%',
  },
  body:{
      height: '92%',
    marginTop: 1, backgroundColor: 'white'
  },
  button:{
   position: 'absolute', bottom: 10, paddingVertical: 10, alignItems: 'center',
   alignSelf: 'center', width: '90%', borderWidth: 1, borderRadius: 20, borderColor: '#c0c0c0'
  },
  timetable:{
    fontSize: 16, fontWeight: '500', color: '#2696b8'
  }
})

export default VirtualClassroom;
