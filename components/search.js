import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, Animated, Dimensions, Keyboard, StyleSheet} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import QuickModal from './QuickModal';
import { db } from '../firebase/firebase';
import { collection, } from 'firebase/firestore';

const { width, height} = Dimensions.get('window');

const Search = () => {
  const [showModal, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');
  const slideAnim = useState(new Animated.Value(width))[0];
  const [showQuickResults, setShowQuickResults] = useState(false);
  const [currentTab, setCurrentTab] = useState('all')
  const [searchResults, setSearchResults] = useState([])
 
  

  const handleTextChange = (text) => {
    setQuery(text);
    if (text.length > 0) {
      quickSearch();
      setShowQuickResults(true);
    } else {
      setShowQuickResults(false);
    }
  };

    // QuickSearch
    const quickSearch = () => {
      // Perform the quick search logic here
      // Update the quick search results based on the query
      // Set the quick search results in state or take any necessary action
    };

    // Search Modal
    const handleTabPress = (tabKey) => {
      setCurrentTab(tabKey);
    };

    const handleSearch = async () => {
      if (query.length > 0) {
        // Perform search or filter logic here based on the query value
        setModalVisible(true);
        setShowQuickResults(false);
        Keyboard.dismiss();
    
        try {
          const batchSize = 10; // Number of results to fetch in each batch
          let lastPostDoc = null; // Reference to the last document from the previous batch
          let lastUserDoc = null; // Reference to the last document from the previous batch
          let postsResults = []; // Array to store the search results for Posts collection
          let usersResults = []; // Array to store the search results for userProfiles collection
    
          // Search in Posts collection
          while (true) {
            let queryRef = db
              .collection('Posts')
              .orderBy('topic')
              .startAfter(lastPostDoc)
              .limit(batchSize);
    
            if (lastPostDoc === null) {
              queryRef = queryRef.where('topic', 'array-contains', query);
            }
    
            const querySnapshot = await queryRef.get();
    
            if (querySnapshot.empty) {
              break; // No more results to fetch
            }
    
            lastPostDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            const batchResults = querySnapshot.docs.map((doc) => doc.data());
            postsResults = postsResults.concat(batchResults);
    
            if (querySnapshot.size < batchSize) {
              break; // Reached the end of the results
            }
          }
    
          // Search in userProfiles collection
          while (true) {
            let queryRef = db
              .collection('userProfiles')
              .orderBy('username')
              .startAfter(lastUserDoc)
              .limit(batchSize);
    
            if (lastUserDoc === null) {
              queryRef = queryRef.where('username', 'array-contains', query);
            }
    
            const querySnapshot = await queryRef.get();
    
            if (querySnapshot.empty) {
              break; // No more results to fetch
            }
    
            lastUserDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            const batchResults = querySnapshot.docs.map((doc) => doc.data());
            usersResults = usersResults.concat(batchResults);
    
            if (querySnapshot.size < batchSize) {
              break; // Reached the end of the results
            }
          }
    
          // Combine the search results
          const searchResults = [...postsResults, ...usersResults];
    
          // Set the search results in state
          setSearchResults(searchResults);
        } catch (error) {
          console.error('Error searching:', error);
          // Handle the error
        }
      } else {
        // Just display the search page
        setShowQuickResults(false);
        setModalVisible(true);
      }
    };
    
    

  useEffect(() => {
    if (showModal) {
      Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: width, duration: 100, useNativeDriver: true }).start();
    }
  }, [showModal]);

  return (
    <View style={styles.container}>
      <View style={styles.holder}>
      <View style={styles.searchBar}>

        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={query}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
        />

        <TouchableOpacity onPress={handleSearch}>
         <MaterialIcons
           name='search'
           size={24}
           color={query.length > 0 ? 'rgba(38, 150, 184, 0.5)' : 'rgba(38, 150, 184, 1)'}
           style={query.length > 0 ? styles.searchIconWithText : styles.searchIconWithoutText}
          />
        </TouchableOpacity>
      </View>
      {query.length > 2 && (
           <QuickModal q={query.toLowerCase()} visible={showQuickResults}/>
        )}
      </View>
   
      <Modal animationType="slide" transparent visible={showModal} onRequestClose={() => setModalVisible(false)} >
        <Animated.View style={[styles.modalContainer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.top}>
           <View style={styles.searchBar}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name='arrow-back' size={24} style={styles.back}/>
            </TouchableOpacity>
             <TextInput
               placeholder="Search"
               style={styles.searchInput}
               value={query}
               onChangeText={handleTextChange}
               onSubmitEditing={handleSearch}
             />

             <TouchableOpacity onPress={handleSearch}>
               <MaterialIcons
                 name='search'
                 size={24}
                 color={query.length > 0 ? 'rgba(38, 150, 184, 0.5)' : 'rgba(38, 150, 184, 1)'}
                 style={query.length > 0 ? styles.searchIconWithText : styles.searchIconWithoutText}
                />
              </TouchableOpacity>
           </View>
          </View>

          <View style={styles.body}>
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tabItem, currentTab === 'all' && styles.activeTab]}
                  onPress={() => handleTabPress('all')}
                >
                  <Text style={styles.text}>All</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.tabItem, currentTab === 'users' && styles.activeTab]}
                  onPress={() => handleTabPress('users')}
                >
                  <Text style={styles.text}>Users</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  style={[styles.tabItem, currentTab === 'media' && styles.activeTab]}
                  onPress={() => handleTabPress('media')}
                >
                  <Text style={styles.text}>Media</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, currentTab === 'services' && styles.activeTab]}
                  onPress={() => handleTabPress('services')}
                >
                  <Text style={styles.text}>Services</Text>
                </TouchableOpacity>
              </View>
              {query.length === 0 &&(
             <Text style={styles.placeholder}>
              Enter keywords to search content
             </Text>
             )}
             
            </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#fafafa', marginBottom:2
  },
  holder:{
    backgroundColor: '#f8f8f8'
  },
  searchIconWithText:{
    color: 'white', padding: 5, 
    backgroundColor: 'rgba(38,150,182, 0.5)',
    borderRadius: 10, 
    marginHorizontal:5,
    borderBottomColor: '#2696b8', borderBottomWidth: 2
  },
  searchIconWithoutText:{
    color: '#2696b8',
    borderBottomWidth:1.5,
    borderRadius:10, borderBottomColor: '#2696b8',
    marginHorizontal:5,
    padding:5, elevation:2, backgroundColor:'white'
  },
  searchInput: {
    flex: 1,
    borderRadius:10,
    padding:5,
    elevation: 2,
    backgroundColor: 'white'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  QuickModal:{
    width: '90%', height: 60, position: 'absolute', bottom: 0, 
  },

  tabContainer: {
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomColor: '#2696b8',
    borderBottomWidth: 2
  },
  tabText: {
    color: 'black',
  },

  top:{
    marginVertical: 10,
    marginRight:5
  },
  back:{
    marginRight:5, padding: 5
  },
  placeholder:{
    position: 'absolute', alignSelf: 'center',
    top: height * 0.5,
  }
});

export default Search;
