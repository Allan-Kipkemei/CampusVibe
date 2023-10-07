import * as React from "react";
import { Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const Messages = ({ style }) => {
  return <Text style={[styles.messages, style]}>{`Messages `}</Text>;
};

const styles = StyleSheet.create({
  messages: {
    fontSize: FontSize.size_mini,
    fontWeight: "600",
    fontFamily: FontFamily.interSemibold,
    color: Color.black,
    textAlign: "left",
  },
});

export default Messages;
