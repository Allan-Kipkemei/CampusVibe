import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const ClubsNormal = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/clubNormal.png')} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
});

export default ClubsNormal;
