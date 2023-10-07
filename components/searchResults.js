import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet} from 'react-native';
import { db } from '../firebase/firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';


const SearchResults = ({ query }) => {
  const [matchingPosts, setMatchingPosts] = useState(['university']);
  const seachResult = query;
  console.log(query)
  console.log

  useEffect(() => {
    const fetchMatchingPosts = async () => {
      const postsRef = collection(db, 'Posts');
      const queryArray = typeof query === 'string' ? query.split(' ') : [];
      const queryRefs = queryArray.map(q => q.trim().toLowerCase());


      if (queryRefs.length < 3) {
        // If query is less than 3 characters, set matchingPosts to an empty array
        setMatchingPosts([]);
        return;
      }
  
      const matchingPostsQuery = query(
        postsRef,
        where('topic', 'array-contains-any', queryRefs),
        where('message', 'array-contains-any', queryRefs),
        where('imageTag', 'array-contains-any', queryRefs)
      );
  
      const unsubscribe = onSnapshot(matchingPostsQuery, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        setMatchingPosts(posts);
      }, (error) => {
        console.log('Error getting matching posts: ', error);
      });
  
      return unsubscribe;
    };
  
    fetchMatchingPosts();
  }, [query]);
  

  return (
    <View style={styles.body}>
      
      {matchingPosts.length > 0 ? (
        <>
        <View style={styles.searchbox}>
           <View style={styles.profile}>
              <Feather name="search" size={24} color="black"/>
           </View>
           <View style={styles.searchbody}>
              <Text style={styles.searchtext}>{seachResult}</Text>
            </View>
         </View>
          <FlatList
             data={matchingPosts}
             keyExtractor={(item) => item.id}
             renderItem={({ item }) => (
              <View style={styles.searchbox}>
                <View style={styles.profile}>
                  {item.profile?(
                    <Image
                        style={styles.profile}
                        source={{uri: item.profileImageUri}}
                      />
                  ) : (
                    <Feather name="search" size={24} color="black"/>
                  )}
                 </View>
                <View style={styles.searchbody}>
                  <Text style={styles.searchtext}>{item.topic}</Text>
                </View>
              </View>
          )}
        />
      </>
      ) : (
     <Text>{null}</Text>
       )}

    </View>
  );
};

const styles = StyleSheet.create({
  body:{
    position: 'absolute',top: 80,
    left: 0, right: 0, bottom: 0
  },
  searchbox:{
    paddingHorizontal: 10,
    flexDirection: 'row'
  }
});

export default SearchResults;
