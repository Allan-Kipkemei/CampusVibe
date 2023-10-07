import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const ExtensionNormal = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/extensionNormal.png')} style={styles.icon} />
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
    width: 24,
    height: 24,
  },
});

export default ExtensionNormal;
