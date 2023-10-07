import * as React from "react";
import { View, Image, StyleSheet, Text, StatusBar} from "react-native";
import { FontSize, FontFamily, Color, Padding } from "../GlobalStyles";
import BackArrow from "./Backarrow";
import { useSelector } from "react-redux";
import Courses from "./courses";

const TimetableTop = () => {
    const campus = useSelector(state => state.campus);
    const courseCode = `${campus.faculty}${campus.course}`
    const courseName = Courses[courseCode];
  return (
    <View style={styles.header}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={styles.post}>
        <BackArrow />
        <Text style={styles.ptext}>{courseName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white', 
    paddingVertical: 20, paddingHorizontal: 10,
  },
  post:{
    flexDirection: 'row',
  },
  ptext:{
    fontSize: 18,
    fontWeight: 600,
    marginLeft: 15,
  }
});

export default TimetableTop;
