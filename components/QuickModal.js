import React, { useEffect, useState } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { orderBy, collection, query, startAt, limit, getDocs, endAt, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const QuickModal = ({ visible, onClose, q }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [isVisible, setIsVisible] = useState(visible);
  const [quickResults, setQuickResults] = useState([]);

  const quickSearch = async () => {
    const postsRef = collection(db, 'Posts');
  
    try {
      const querySnapshot = await getDocs(
        query(
          postsRef,
          where('topic', '>=', q),
          where('topic', '<=', q + '\uf8ff'),
          orderBy('topic'),
          limit(10)
        )
      );
  
      console.log('Query snapshot:', querySnapshot);
  
      const results = querySnapshot.docs.map((doc) => {
        const { topic } = doc.data();
        const suggestion = topic.substring(
          topic.indexOf(q),
          topic.indexOf(q) + q.length
        );
        return suggestion;
      });
  
      console.log('Query results:', results);
  
      setQuickResults(results);
    } catch (error) {
      console.error('Error performing quick search:', error);
      setQuickResults([]);
    }
  };
  

  useEffect(() => {
    if (visible && q.length > 0) {
      quickSearch();
      setIsVisible(true);
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      setIsVisible(false);
      Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }).start();
    }
  }, [visible, q, slideAnim]);

  useEffect(() => {
    if (!visible) {
      setQuickResults([]);
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
      {quickResults.length > 0 ? (
        quickResults.map((result, index) => (
          <Text key={index} style={styles.resultItem}>{result}</Text>
        ))
      ) : (
        <Text style={styles.message}>No quick results found</Text>
      )}
    </Animated.View>
  );
};



const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    minHeight: 60,
    width: '100%',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  message: {
    alignSelf: 'center',
    marginTop: 10,
    color: '#2696b8',
  },
  resultItem: {
    marginBottom: 5,
  },
});

export default QuickModal;
