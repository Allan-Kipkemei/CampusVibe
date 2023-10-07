import * as React from "react";
import { StyleProp, ViewStyle, Text, StyleSheet } from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const Chats = ({ style }) => {
  return <Text style={[styles.chats, style]}>Chats</Text>;
};

const styles = StyleSheet.create({
  chats: {
    fontSize: FontSize.size_mini,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.black,
    textAlign: "left",
    fontWeight: '600',
  },
});

export default Chats;
