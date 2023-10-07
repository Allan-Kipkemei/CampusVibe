import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const HomeNormal = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/homeNormal.png')} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  icon: {
    width: 22,
    height: 22,

  },
});

export default HomeNormal;
