import React, { useEffect, useState, useCallback} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Snippet from '../components/snippet';
import { useSelector } from 'react-redux';
import { db } from '../firebase/firebase';
import { collection, onSnapshot, where, query, doc } from 'firebase/firestore';


const Tagged = ({userId}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'Posts'), where('tagList', 'array-contains', userId)),
      (querySnapshot) => {
        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <View style={styles.container}>
     <FlatList
        data={posts}
        renderItem={({ item }) => <Snippet post={item} postId={item.id} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContent}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
  },
});

export default Tagged;
