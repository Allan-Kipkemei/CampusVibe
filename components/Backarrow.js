import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BackArrow = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={StyleSheet.back}>
        <MaterialIcons name="arrow-back" size={25} color="#000" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    back:{
        
    }
});
export default BackArrow;
