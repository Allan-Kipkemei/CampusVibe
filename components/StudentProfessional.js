import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const StudentProfessional = () => {
  const navigation = useNavigation();

  const handleUpgrade = () => {
    navigation.navigate('CreateProfessionalAccount');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You already have a professional account</Text>
      <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
        <Text style={styles.upgradeButtonText}>Upgrade to a Higher Package</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({})

export default StudentProfessional;
