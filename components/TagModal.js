import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { db } from '../firebase/firebase';
import { collection, where, orderBy, limit, getDocs, query} from 'firebase/firestore';


const UserTaggingTextInput = (props) => {

  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  useEffect(() => {
    setTagList([]);
    setInputText('');
  }, [props.id]);

  
  const handleTextInputChange = (text) => {
    setInputText(text);
    setCursorPosition(text.length);
    const startIndex = text.lastIndexOf('@');
    if (startIndex !== -1 && startIndex === text.length - 1) {
      const q = text.substring(startIndex + 1); // remove the '@' symbol
      console.log(q, 'is query');
      const collectionRef = collection(db, 'userProfiles');
      const queryRef = query(
        collectionRef,
        where('username', '>=', q),
        where('username', '<=', q + '\uf8ff'),
        orderBy('username'),
        limit(10)
      );
      getDocs(queryRef)
        .then((querySnapshot) => {
          const matches = querySnapshot.docs.map((doc) => {
            const { username, profileImageUrl, userId, field } = doc.data();
            return { username, profileImageUrl, userId, field};
          });
          setSuggestions(matches);
        })
        .catch((error) => {
          console.log('Error getting user profiles:', error);
        });
    } else {
      setSuggestions([]);
    }
  };
  
  useEffect(() => {
    props.onTagListChange(tagList);
    props.onMessageChange(inputText);
  }, [tagList, inputText, props]);
  
  useEffect(() => {
    handleTextInputChange(inputText);
  }, [inputText]);
  
  useEffect(() => {
    handleTextInputChange('');
  }, [props.id]);
  

  
const handleSuggestionPress = (userId) => {
  const matchedSuggestion = suggestions.find((suggestion) => suggestion.userId === userId);
  const matchedText = `${matchedSuggestion.username}`;
  const remainingText = inputText.substring(cursorPosition);
  const newText = `${inputText.substring(0, cursorPosition)}${matchedText}${remainingText}`;
  const newTag = { userId: matchedSuggestion.userId, username: matchedSuggestion.username };
  setTagList([...tagList, newTag]);
  setInputText(newText);
  setSuggestions([]);
};


  const renderSuggestion = ({ item }) => {
    const defaultProfileImage = require('../assets/graduate.png')
    const profileImage = typeof item.profileImageUrl === 'string' ? { uri: item.profileImageUrl } : defaultProfileImage;
    return (
      <TouchableOpacity style={styles.renderContainer}  onPress={() => handleSuggestionPress(item.userId)}>
         <Image source={profileImage} style={styles.profileImage} />
         <View style={styles.column}>
           <Text style={styles.name}>{item.username} </Text>
           <Text style={styles.course}>{item.field} </Text>
         </View>
      </TouchableOpacity>
    );
  };
  
  
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.circle1}></View>
        <View style={styles.circle2}></View>
       <TextInput
         style={styles.textInput}
         placeholder="Share your vibe..."
         onChangeText={handleTextInputChange}
         value={inputText}
         multiline
         maxLength={500}
         textAlignVertical="top" 
        />
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item.userId}
          style={{ maxHeight: 150 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    marginHorizontal:10
  },
  renderContainer:{
    // borderWidth:1,
    flexDirection:'row',
    alignItems:'center',
    padding:5
  },
  profileImage:{
    width: 40, height:40, borderRadius:100
  },
  column:{
    marginHorizontal:10
  },
  course:{
    color:'#707070'
  }, 
  textInput:{
    borderWidth:1,
    borderColor:'#c0c0c0',
    padding:10, height:120, 
    borderRadius:10,
    marginTop:15,
    width:'90%'
  },
  circle1:{
    borderRadius:100, borderWidth:1,
    width:5, height:5,
    borderColor: '#c0c0c0'
  },
  circle2:{
    borderRadius:100, borderWidth:1,
    width:15, height:15,
    marginTop:3, borderColor: '#c0c0c0'
  },
  bubble:{
    flexDirection:'row'
  }


    
});
export default UserTaggingTextInput;
