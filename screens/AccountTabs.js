import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import Posts from './Posts';
import Tagged from './Tagged';

const AccountTabs = ({ setTopicCount, userId }) => {
  const [activeTab, setActiveTab] = useState('posts');

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'posts' && styles.activeTab]}
          onPress={() => handleTabPress('posts')}
         >
          <MaterialCommunityIcons name="clipboard-play-multiple" size={20} color="#404040" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'tagged' && styles.activeTab]}
          onPress={() => handleTabPress('tagged')}
        >
           <MaterialIcons name="tag" size={20} color="#404040" />
        </TouchableOpacity>
      </View>

      {activeTab === 'posts' && <Posts setTopicCount={setTopicCount} userId={userId}/>}
      {activeTab === 'tagged' && <Tagged userId={userId}/>}
    </View>
  );
};


const styles = StyleSheet.create({
  tabContainer: {
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
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
});

export default AccountTabs;
