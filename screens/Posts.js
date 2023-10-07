import React, { useEffect, useState, useCallback} from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView} from 'react-native';
import Snippet from '../components/snippet';
import { useSelector } from 'react-redux';
import { db } from '../firebase/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from '@expo/vector-icons'


const RadioPickerItem = ({ label, value, isSelected, onPress }) => {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={() => onPress(value)}>
      <View style={[styles.radioButtonIcon, isSelected && styles.radioButtonIconSelected]} />
      <Text style={[styles.radioText, isSelected && styles.radioActiveText]}>{label}</Text>
    </TouchableOpacity>
  );
};
const Posts = ({ setTopicCount, userId }) => {
  const [posts, setPosts] = useState([]);
  const [sortingOption, setSortingOption] = useState('latest');
  const userProfile = useSelector((state) => state.userProfile);

  useEffect(() => {
    let postsQuery;

    const fetchPosts = async () => {
      switch (sortingOption) {
        case 'latest':
          postsQuery = query(
            collection(db, 'Posts'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          );
          break;
        case 'earliest':
          postsQuery = query(
            collection(db, 'Posts'),
            where('userId', '==', userId),
            orderBy('createdAt', 'asc')
          );
          break;
        case 'top':
          postsQuery = query(
            collection(db, 'Posts'),
            where('userId', '==', userId),
            orderBy('likes', 'asc')
          );
          break;
        default:
          postsQuery = query(
            collection(db, 'Posts'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          );
      }

      const unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
        setTopicCount(querySnapshot.size);
      });

      return () => {
        unsubscribePosts();
      };
    };

    fetchPosts();
  }, [sortingOption, userId]);

  const renderPickerItems = () => {
    const sortingOptions = [
      { label: 'Latest', value: 'latest' },
      { label: 'Earliest', value: 'earliest' },
      { label: 'Top', value: 'top' },
    ];

    return sortingOptions.map((option) => (
      <RadioPickerItem
        key={option.value}
        label={option.label}
        value={option.value}
        isSelected={sortingOption === option.value}
        onPress={setSortingOption}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.sort}
        showsHorizontalScrollIndicator={false}
       >
        <Text style={styles.header}>Sort</Text>
        {renderPickerItems()}
      </ScrollView>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Snippet post={item} postId={item.id} />}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container:{
    backgroundColor: '#f0f0f0'
  },

  sort:{
    borderWidth: 1, margin:2,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 100,
    height:35,
    backgroundColor: '#ffff', 
  },
  picker:{
    width: 120
  },
  pickerItem: {
    // fontSize: 13, 
    color: '#000',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButtonIcon: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 8,
  },
  radioButtonIconSelected: {
    backgroundColor: '#000',
  },
  header:{
    position:'absolute', 
    left:10
  },
  radioActiveText:{
    color: '#000'
  },
  radioText:{
    color:"#707070"
  }

});

export default Posts;
