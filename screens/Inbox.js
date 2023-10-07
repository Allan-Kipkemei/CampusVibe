import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Topnav from '../components/Topnav';

const Inbox = () => {
  const [activeTab, setActiveTab] = useState('Chats');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <View style={styles.container}>
      <Topnav />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Chats' && styles.activeTab]}
          onPress={() => handleTabChange('Chats')}
        >
          <Text style={[styles.tabText, activeTab === 'Chats' && styles.activeTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Notifications' && styles.activeTab]}
          onPress={() => handleTabChange('Notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'Notifications' && styles.activeTabText]}>Notifications</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {/* Render content based on the active tab */}
        {activeTab === 'Chats' ? (
          <Text style={styles.contentText}>Chats content goes here.</Text>
        ) : (
          <Text style={styles.contentText}>Notifications content goes here.</Text>
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

export default Inbox;
