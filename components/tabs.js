import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import ClubsScreen from './ClubView.js';
import GroupsScreen from './GroupView.js';

const TabBar = () => {
  const [activeTab, setActiveTab] = React.useState('clubs');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>

{/* Clubs screen................ */}
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'clubs' && styles.activeTabButton]}
        onPress={() => handleTabPress('clubs')}
      >
        <Text style={styles.tabButtonText}>Clubs</Text>
      </TouchableOpacity>

{/* Groups screen............... */}
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'groups' && styles.activeTabButton]}
        onPress={() => handleTabPress('groups')}
      >
        <Text style={styles.tabButtonText}>Study Groups</Text>
      </TouchableOpacity>
      {activeTab === 'clubs' ? <ClubsScreen /> : <GroupsScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 16,
  },
  activeTabButton: {
    backgroundColor: 'black',
  },
});

export default TabBar;
