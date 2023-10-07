import React, { useState, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NetworkError = ({ message }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        // Automatically clear the error after 3 seconds
        hideError();
      }, 6000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      hideError();
    }
  }, [message, slideAnim]);

  const hideError = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity style={styles.content}>
        <Ionicons name="alert-circle" size={24} color="#ff8c00" style={styles.icon} />
        <Text style={styles.messageText}>{message}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={hideError}>
        <Ionicons name="close" size={24} color="gray" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9edda',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  messageText: {
    color: '#ff8c00',
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
  },
});

export default NetworkError;
