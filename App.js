const Stack = createNativeStackNavigator();
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Account from "./screens/Account";
import StartPage from "./screens/StartPage.js";
import Landing from "./screens/Landing";
import CreateProfile from "./screens/CreateProfile";
import Groups from "./screens/Groups";
import Clubs from "./screens/Clubs";
import CreateClub from "./screens/CreateClub";
import CreateGroup from "./screens/CreateGroup";
import CreatePost from "./screens/CreatePost";
import Feed from "./screens/Feed";
import Inbox from "./screens/Inbox";
import HomeActive from "./components/HomeActive";
import HomeNormal from "./components/HomeNormal";
import EditProfile from "./screens/EditProfile";
import AuthPage from "./screens/Authpage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { store, persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Timetable from "./timetableApp";
import CreateProfessionalAccount from "./screens/CreateProfessionalAccount";
import Payment from "./screens/Payment";
import AccountUpgrade from "./components/AccountUpgrade";
import VisitUserProfile from "./components/VisitUserProfile";
import { useNavigation } from "@react-navigation/native";
import ClubActive from "./components/ClubsActive.js";
import ClubsNormal from "./components/ClubsNormal.js";

const Tab = createBottomTabNavigator();

function BottomTabsRoot() {
  const defaultProfileImage = require("./assets/graduate.png");
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

  const userProfile = useSelector((state) => state.userProfile);

  useEffect(() => {
    setProfileImage(
      userProfile.profileImage
        ? { uri: userProfile.profileImage }
        : defaultProfileImage
    );
  }, [userProfile]);
  const bottomTabItemsNormal = [
    <HomeNormal />,
    <ClubsNormal />,
    <Pressable
      key={2}
      onPress={() =>
        tabBarNavigation.navigate("CreatePost", {
          params: { action: "new" },
        })
      }
    >
      <MaterialCommunityIcons
        name="circle-edit-outline"
        size={30}
        color="white"
        style={styles.circle}
      />
    </Pressable>,

    <FontAwesome name="envelope-o" size={24} color="#000" />,
    <Image source={profileImage} style={styles.icon} />,
  ];

  const bottomTabItemsActive = [
    <HomeActive />,
    <ClubActive />,
    null,
    <FontAwesome name="envelope" size={24} color="#000" />,
    <Image source={profileImage} style={styles.iconActive} />,
  ];

  const tabBarNavigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarVisible: route.name !== "CreatePost", // Hide the bottom tab bar on the 'CreatePost' screen
      })}
      tabBar={({ state, descriptors, navigation }) => {
        const activeIndex = state.index;
        return (
          <View style={styles.bottomtab}>
            {bottomTabItemsNormal.map((item, index) => {
              const isFocused = state.index === index;
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    navigation.navigate({
                      name: state.routes[index].name,
                      merge: true,
                    });
                  }}
                >
                  {activeIndex === index
                    ? bottomTabItemsActive[index] || item
                    : item}
                </Pressable>
              );
            })}
          </View>
        );
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Clubs"
        component={Clubs}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Inbox"
        component={Inbox}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="VisitUserProfile"
        component={VisitUserProfile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          <NavigationContainer>
            {hideSplashScreen ? (
              <Stack.Navigator
                initialRouteName="AuthPage"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="AuthPage" component={AuthPage} />
                <Stack.Screen
                  name="BottomTabsRoot"
                  component={BottomTabsRoot}
                />
                <Stack.Screen
                  name="StartPage"
                  component={StartPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Landing"
                  component={Landing}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CreateProfile"
                  component={CreateProfile}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="EditProfile"
                  component={EditProfile}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Feed"
                  component={Feed}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Groups"
                  component={Groups}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CreateClub"
                  component={CreateClub}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CreateGroup"
                  component={CreateGroup}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CreatePost"
                  component={CreatePost}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Account"
                  component={Account}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Timetable"
                  component={Timetable}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Payment"
                  component={Payment}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AccountUpgrade"
                  component={AccountUpgrade}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="VisitUserProfile"
                  component={VisitUserProfile}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CreateProfessionalAccount"
                  component={CreateProfessionalAccount}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            ) : null}
          </NavigationContainer>
        </>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  iconActive: {
    width: 30,
    height: 30,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#2C96B8",
  },
  bottomtab: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 25,
    height: 60,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    zIndex: 2,
  },
  circle: {
    backgroundColor: "#2696b8",
    padding: 8,
    borderRadius: 100,
    elevation: 5,
  },
  circleactive: {
    backgroundColor: "#00BFFF",
    padding: 8,
    borderRadius: 100,
    elevation: 5,
  },
  plus: {
    width: 50,
    height: 50,
  },
});
export default App;
