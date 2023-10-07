import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ImageView from './ImageModal';

const Media = () => {
  const [posts, setPosts] = useState([]);
  const userProfile = useSelector((state) => state.userProfile);
  const userId = userProfile.userId;

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'Posts'), where('userId', '==', userId), where('imageUri', '!=', '')), (querySnapshot) => {
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts(fetchedPosts);
    });
  
    return () => unsubscribe();
  }, [userId]);
  

  const renderImage = ({ item }) => (
    <Image
      source={{ uri: item.imageUri }}
      style={styles.image}
      key={item.id}
    />
  );

  return (
      <View style={styles.container}>
        <FlatList
          data={posts}
          renderItem={renderImage}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
  );
};

const styles = StyleSheet.create({
    flatListContent:{
        backgroundColor: 'white'
    },
        container: {
          
        },
        row: {
          alignItems:'flex-start'
        },
        image: {
          width: '32%',
          aspectRatio: 1,
          margin: 2,
        },
      });

export default Media;
