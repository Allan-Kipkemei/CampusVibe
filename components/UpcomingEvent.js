import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  TouchableHighlight,
} from "react-native";

const Event = () => {
  return (
<View style={[styles.frame, styles.frameLayout]}>
     <View style={styles.ellipseParent}>
         <Image style={styles.frameChild} resizeMode="cover" source={require("../assets/ellipse-2.png")}/>

         <View style={styles.operationsResearch1Parent}>
             <Text style={[styles.operationsResearch1, styles.lecKiiruTypo]}>
                 {'Operations Research 1'}
             </Text>
             <Text style={[styles.lecKiiru, styles.lecKiiruTypo]}>
                  {'Lec Kiiru'}
             </Text>
          </View>
        </View>

<View style={[styles.frameParent, styles.parentSpaceBlock]}>
  <View>
    <Text style={[styles.linearProgramming,styles.wednesday18JanTypo,]} >
      Linear Programming
    </Text>

    <View style={styles.parentSpaceBlock}>
      <Image style={[styles.iconsaxlinearedit,styles.iconCalendarLayout,]}
        resizeMode="cover"
        source={require("../assets/iconsaxlinearedit.png")}
      />
      <Text style={[styles.assignmentAttendance,styles.wednesday18JanTypo,]}>
        Assignment, Attendance
      </Text>
    </View>

    <View style={[styles.iconCalendarParent, styles.parentSpaceBlock]}>
      <Image
        style={styles.iconCalendarLayout}
        resizeMode="cover"
        source={require("../assets/-icon-calendar.png")}
      />
      <Text style={[styles.wednesday18Jan, styles.wednesday18JanTypo]}>
        Wednesday, 18 Jan 2023
      </Text>
    </View>

  </View>
  <TouchableHighlight style={[styles.iconsaxlinearnotification,styles.iconsaxlinearnotificationLayout,]}
    underlayColor="#000"
    onPress={() => {}}
  >
    <Image
      style={styles.icon}
      resizeMode="cover"
      source={require("../assets/iconsaxlinearnotification.png")}
    />
  </TouchableHighlight>
</View>
</View>
  )};

  const styles=StyleSheet.create({
  
  })
  
  export default Event;