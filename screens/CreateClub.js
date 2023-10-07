import * as React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { TextInput as RNPTextInput } from "react-native-paper";
import Topnav from "../components/Topnav";
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";

const CreateClub = () => {
  return (
    <View style={styles.createClub}>
      <Topnav />
    </View>
  );
};

const styles = StyleSheet.create({

});

export default CreateClub;
