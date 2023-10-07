import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  RefreshControl,
  VirtualizedList,
  BackHandler,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Text,
  Animated,
  Easing,
} from 'react-native';
import Topnav from '../components/Topnav';
import Snippet from '../components/snippet';
import { useNavigation } from '@react-navigation/native';
import Search from '../components/search.js';
import { db } from '../firebase/firebase';
import {
  getDocs,
  collection,
  orderBy,
  query,
  where,
  startAfter,
  limit,
} from 'firebase/firestore';
import CampusModal from '../components/filterTopButton';
import { useSelector } from 'react-redux';
import NetworkError from '../components/NetworkError';

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 10; // Number of posts to fetch in a single query

const mergePosts = (userFilterPosts, popularPosts, latestPosts) => {
  // Function to merge user filter posts with 70% popular posts and 30% latest posts
  const mergedPosts = [];

  // Merge user filter posts
  let i = 0;
  while (i < userFilterPosts.length) {
    mergedPosts.push(userFilterPosts[i]);
    i++;
  }

  // Merge 70% popular posts
  i = 0;
  let j = 0;
  while (i < popularPosts.length) {
    if (j < mergedPosts.length) {
      mergedPosts.splice(j, 0, popularPosts[i]);
      i++;
      j += 2;
    } else {
      mergedPosts.push(popularPosts[i]);
      i++;
      j++;
    }
  }

  // Merge 30% latest posts
  i = 0;
  j = 1;
  while (i < latestPosts.length) {
    if (j < mergedPosts.length) {
      mergedPosts.splice(j, 0, latestPosts[i]);
      i++;
      j += 2;
    } else {
      mergedPosts.push(latestPosts[i]);
      i++;
      j++;
    }
  }

  return mergedPosts;
};


const Feed = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [lastVisiblePost, setLastVisiblePost] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [errorMessage, setNetworkError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const active = useSelector((state) => state.filter.filter);
  const fetchedPostIds = useRef(new Set()); // Using a set to store the IDs of fetched posts
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerThreshold = 100; // Threshold to trigger hiding/showing the search component

  const fetchInitialPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching initial posts...');

      const userFilterPostsQuery = query(
        collection(db, 'Posts'),
        where('audience', '==', active),
        orderBy(active === 'popular' ? 'likes' : 'createdAt', 'desc'),
        limit(PAGE_SIZE)
      );

      const userFilterSnapshot = await getDocs(userFilterPostsQuery);
      const userFilterPostsData = userFilterSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const popularPostsQuery = query(
        collection(db, 'Posts'),
        where('audience', '==', 'popular'),
        orderBy('likes', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE * 0.7)
      );

      const latestPostsQuery = query(
        collection(db, 'Posts'),
        where('audience', '==', 'latest'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE * 0.3)
      );

      const popularSnapshot = await getDocs(popularPostsQuery);
      const latestSnapshot = await getDocs(latestPostsQuery);

      const popularPostsData = popularSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const latestPostsData = latestSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const mergedPostsData = mergePosts(
        userFilterPostsData,
        popularPostsData,
        latestPostsData
      );

      if (mergedPostsData.length === 0) {
        if (active !== 'all') {
          setPosts([]);
          setLastVisiblePost(null);
          setHasMorePosts(true);
          fetchedPostIds.current = new Set(); // Clear the fetched post IDs
          fetchMorePosts();
          return;
        }

        const alert = `Try again later`;
        setNetworkError(alert);
        setHasMorePosts(false);
      } else {
        setLastVisiblePost(mergedPostsData[mergedPostsData.length - 1]);
        setHasMorePosts(true);
      }

      setPosts(mergedPostsData);
      // Store the IDs of fetched posts in the set
      mergedPostsData.forEach((post) => fetchedPostIds.current.add(post.id));
    } catch (error) {
      console.error('Firestore Network Error:', error.code, error.message);
      const errorMessage = 'Please check your internet connection and try again!';
      setNetworkError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePosts = async () => {
    try {
      if (!hasMorePosts) return;

      setLoadingMore(true);
      console.log('Fetching more posts...');

      const userFilterPostsQuery = query(
        collection(db, 'Posts'),
        where('audience', '==', active),
        orderBy(active === 'popular' ? 'likes' : 'createdAt', 'desc'),
        startAfter(lastVisiblePost),
        limit(PAGE_SIZE)
      );

      const userFilterSnapshot = await getDocs(userFilterPostsQuery);
      const userFilterPostsData = userFilterSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Remove already fetched posts from the results
      const uniquePostsData = userFilterPostsData.filter(
        (post) => !fetchedPostIds.current.has(post.id)
      );

      // If all fetched posts are already in the list, there are no more posts to fetch
      if (uniquePostsData.length === 0) {
        setHasMorePosts(false);
      } else {
        uniquePostsData.forEach((post) => fetchedPostIds.current.add(post.id));
        setLastVisiblePost(uniquePostsData[uniquePostsData.length - 1]);
      }

      setPosts((prevPosts) => [...prevPosts, ...uniquePostsData]);
    } catch (error) {
      console.error('Firestore Network Error:', error.code, error.message);
      const errorMessage = 'Please check your internet connection and try again!';
      setNetworkError(errorMessage);
    } finally {
      setLoadingMore(false);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialPosts();
    setRefreshing(false);
  };

  const getItemCount = useCallback((data) => data.length, []);
  const getItem = useCallback((data, index) => data[index], []);
  const renderVirtualizedItem = useCallback(({ item }) => (
    <Snippet post={item} postId={item.id} />
  ), []);

  const handleFetchMorePosts = () => {
    if (!loadingMore && hasMorePosts) {
      fetchMorePosts();
    }
  };

  const ListHeaderComponent = () => {
    return <Search />;
  };

  const ListFooterComponent = () => {
    if (!hasMorePosts && posts.length > 0) {
      return (
        <View style={styles.noMorePosts}>
          <Text>No more posts. Try changing the feed filter.</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.feed}>
      <Topnav screen={'feed'} />
      <StatusBar barStyle={'dark-content'} backgroundColor={'#ffff'} />

      <VirtualizedList
        showsVerticalScrollIndicator={false}
        data={posts}
        renderItem={renderVirtualizedItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        onEndReached={handleFetchMorePosts}
        onEndReachedThreshold={0.5} 
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {loadingMore && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size={'large'} color={'#2696b8'} />
        </View>
      )}

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size={'small'} color={'#2696b8'} />
        </View>
      )}



      {errorMessage && <NetworkError message={errorMessage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  feed: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  flatListContent: {
    // paddingBottom: 16,
  },
  loadingMore: {
    alignSelf: 'center',
    padding:5, 
    // backgroundColor: 'white',
    marginVertical:2, width:width
  },
  loading: {
    position: 'absolute',
    top: height / 2 - 20,
    left: width / 2 - 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMorePosts: {
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default Feed;
