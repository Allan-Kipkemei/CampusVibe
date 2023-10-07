import React, { useState, useEffect} from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Dimensions, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import FollowingFF from './FollowFF';
import { useSelector } from 'react-redux';


const FFModal = ({ activeTab, username,profileImage, showModal, hideModal, userId, screen }) => {
    const navigation = useNavigation();
    const { width } = Dimensions.get('window');
    const slideAnim = React.useRef(new Animated.Value(width)).current;
    const [currentTab, setCurrentTab] = useState(activeTab);
  //  const userId = useSelector((state => state.userProfile.userId))

    const handleTabPress = (tabKey) => {
      setCurrentTab(tabKey);
    };
  
    useEffect(() => {
      if (showModal) {
        Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start();
      } else {
        Animated.timing(slideAnim, { toValue: width, duration: 100, useNativeDriver: true }).start();
      }
    }, [showModal]);

  
    return (
      <View>
        <Modal animationType="none" transparent={true} visible={showModal} onRequestClose={hideModal}>
          <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.header}>
              <Image style={styles.profileImage} source={profileImage}/>
              <Text style={styles.sett}>{username}</Text>
              <TouchableOpacity onPress={hideModal} style={styles.back}>
                 <MaterialIcons name="cancel" size={24} color="#404040" />
              </TouchableOpacity>
            </View>
            {/* Body */}
  
            <View style={styles.body}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tabItem, currentTab === 'following' && styles.activeTab]}
                  onPress={() => handleTabPress('following')}
                >
                  <Text style={styles.text}>Following</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.tabItem, currentTab === 'followers' && styles.activeTab]}
                  onPress={() => handleTabPress('followers')}
                >
                  <Text style={styles.text}>Followers</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.tabItem, currentTab === 'suggestions' && styles.activeTab]}
                  onPress={() => handleTabPress('suggestions')}
                >
                  <Text style={styles.text}>Suggestions</Text>
                </TouchableOpacity>
              </View>
  
              {currentTab === 'following' && 
                <FollowingFF MyUserId={userId} active={'following'} screen={screen}/>
              }
               {currentTab === 'followers' && 
                <FollowingFF MyUserId={userId} active={'followers'} screen={screen}/>
              }
              {/* {currentTab === 'suggestions' && 'add component here'}   */}
            </View>
          </Animated.View>
        </Modal>
      </View>
    );
  };
  
  

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#ffff',
    width: '100%', height: '100%'
  },
  header:{
    backgroundColor: 'white',
    height: 60, flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  sett:{
     fontSize: 18,
     fontWeight: '500'
  },
  tabContainer: {
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomColor: '#2696b8',
    borderBottomWidth: 2
  },
  tabText: {
    color: 'black',
  },
  profileImage:{
    width: 30, height: 30, borderRadius: 100,
  },
  text:{
    fontSize: 13,
    color: '#404040'
  }
 
});

export default FFModal;
