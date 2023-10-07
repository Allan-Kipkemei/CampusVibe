import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Topnav from '../components/Topnav';

const Clubs = () => {
  const [activeTab, setActiveTab] = useState('clubs');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <View style={styles.container}>
      <Topnav />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'clubs' && styles.activeTab]}
          onPress={() => handleTabChange('clubs')}
        >
          <Text style={[styles.tabText, activeTab === 'clubs' && styles.activeTabText]}>Clubs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => handleTabChange('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Study Groups</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {/* Render content based on the active tab */}
        {activeTab === 'clubs' ? (
          <Text style={styles.contentText}>Club content goes here.</Text>
        ) : (
          <Text style={styles.contentText}>Group content goes here.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffff',
    // borderWidth:1
  },
  tab: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
  },
  tabText: {
    // fontSize: 18,
    // color: '#fff',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2696b8',
  },
  activeTabText: {
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentText: {
    fontSize: 20,
    color: '#333',
  },
});

export default Clubs;
