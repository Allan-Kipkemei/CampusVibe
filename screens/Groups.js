import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Border, FontSize, Padding } from "../GlobalStyles";

const Groups = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.groups}>
      <Text>Groups</Text>
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Groups;
