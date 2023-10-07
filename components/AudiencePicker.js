import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const audienceOptions = [
  { label: 'Everyone', value: 'all', icon: 'globe' },
  { label: 'Campus', value: 'campus', icon: 'school' },
  { label: 'Faculty', value: 'faculty', icon: 'graduation-cap' },
];

const AudiencePicker = ({ audience, setAudience, campus, isPickerOpen, setPickerOpen }) => {
    const closeModal = () => {
      setPickerOpen(false);
    };
  
    return (
      <Modal
        visible={isPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeModal}>
          <View style={styles.audiencePicker}>
            {audienceOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[styles.audienceButton, audience === option.label && styles.selectedAudienceButton]}
                onPress={() => {
                  setAudience(option.label);
                  setPickerOpen(false);
                }}
              >
                <FontAwesome5 name={option.icon} size={20} color="#000" />
                <Text
                  style={[styles.audienceButtonText, audience === option.label && styles.selectedAudienceButtonText]}
                 >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    audiencePicker: {
      backgroundColor: '#fff',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    audienceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      marginBottom: 10,
      borderRadius: 10,
    },
    selectedAudienceButton: {
      backgroundColor: '#2696b8',
    },
    audienceButtonText: {
      marginLeft: 10,
      color: '#000',
      fontSize: 16,
    },
    selectedAudienceButtonText: {
      color: '#fff',
    },
  });
  
  export default AudiencePicker;
  