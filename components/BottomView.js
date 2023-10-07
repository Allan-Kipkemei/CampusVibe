import * as React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { Padding, FontFamily, FontSize, Color, Border } from "../GlobalStyles";

const BottomView = () => {
  return (
    <View style={styles.bottomview}>
      <View style={[styles.postbar, styles.postbarSpaceBlock]}>
        <View style={styles.iconImage}>
          <Image
            style={styles.vectorIcon}
            resizeMode="cover"
            source={require("../assets/vector4.png")}
          />
        </View>
        <View style={styles.iconBarChartLine}>
          <Image
            style={styles.vectorIcon}
            resizeMode="cover"
            source={require("../assets/vector5.png")}
          />
        </View>
        <View style={styles.gifWrapper}>
          <Text style={[styles.gif, styles.gifTypo]}>GIF</Text>
        </View>
        <View style={[styles.postbtn, styles.postbarSpaceBlock]}>
          <Text style={[styles.post, styles.gifTypo]}>Post</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postbarSpaceBlock: {
    paddingVertical: Padding.p_2xs,
    flexDirection: "row",
  },
  gifTypo: {
    textAlign: "left",
    fontFamily: FontFamily.interSemibold,
    fontWeight: "600",
  },
  vectorIcon: {
    width: 20,
    height: 21,
  },
  iconImage: {
    flexDirection: "row",
  },
  iconBarChartLine: {
    marginLeft: 65,
    flexDirection: "row",
  },
  gif: {
    fontSize: FontSize.size_5xs,
    color: Color.black,
    width: 14,
  },
  gifWrapper: {
    borderRadius: Border.br_8xs,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    padding: Padding.p_8xs,
    marginLeft: 65,
    alignItems: "center",
  },
  post: {
    fontSize: FontSize.size_sm,
    color: Color.white,
  },
  postbtn: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.steelblue_200,
    paddingHorizontal: Padding.p_4xl,
    marginLeft: 65,
  },
  postbar: {
    backgroundColor: Color.white,
    height: 70,
    paddingHorizontal: Padding.p_9xl,
    alignItems: "center",
  },
  bottomview: {
    position: "absolute",
    top: 782,
    left: 0,
  },
});

export default BottomView;
