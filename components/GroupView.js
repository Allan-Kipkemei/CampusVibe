import * as React from "react";
import { View, ImageBackground, StyleSheet, Text } from "react-native";
import { Color, FontFamily, Border, FontSize, Padding } from "../GlobalStyles";

const ClubView = () => {
  return (
    <View style={styles.art1Parent}>
    
      <View style={styles.message}>
        <View>
          <Text style={styles.mmuFootballClub}>MMU Football club</Text>
          <Text style={[styles.members, styles.pmTypo]}>647 members</Text>
          <Text style={[styles.members, styles.pmTypo]}>
            Upcoming: Game talk
          </Text>
        </View>
        <Text style={[styles.pm, styles.pmTypo]}>12:45 PM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pmTypo: {
    color: Color.gray_400,
    fontFamily: FontFamily.interRegular,
    textAlign: "left",
  },
  art1Icon: {
    borderTopLeftRadius: Border.br_8xs,
    borderBottomLeftRadius: Border.br_8xs,
    width: 73,
    height: 73,
  },
  mmuFootballClub: {
    fontSize: FontSize.size_sm,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: Color.black,
    textAlign: "left",
  },
  members: {
    fontSize: FontSize.size_xs,
    marginTop: 5,
  },
  pm: {
    fontSize: FontSize.size_3xs,
    marginLeft: 108,
  },
  message: {
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: 0,
    marginLeft: 12,
    flexDirection: "row",
  },
  art1Parent: {
    position: "absolute",
    top: 155,
    left: 7,
    borderRadius: Border.br_3xs,
    backgroundColor: Color.white,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default ClubView;
