import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { View, Image, StyleSheet } from "react-native";

const AuthPage = ({ navigation }) => {
  const userId = useSelector((state) => state.userProfile.userId);
 
  useEffect(() => {
    const checkLogin = async () => {
      if (userId) {
        navigation.navigate("BottomTabsRoot", {
          screen: "Feed",
        });
      } else {
        navigation.navigate("StartPage");
      }
    };
    checkLogin();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/graduate.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  image:{
    width: 100, height: 100, alignSelf:'center',
  },
});

export default AuthPage;
