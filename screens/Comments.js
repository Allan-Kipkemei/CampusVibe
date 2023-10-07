import React, { useState, useEffect,useCallback} from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Animated, Dimensions, TextInput, VirtualizedList, StatusBar} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import Snippet from '../components/snippet';
import CreateComment from './CreateComment';
import CommentSnippet from '../components/CommentSnippet';


// Sorting option component
const RadioPickerItem = ({ label, value, isSelected, onPress }) => {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={() => onPress(value)}>
      <View style={[styles.radioButtonIcon, isSelected && styles.radioButtonIconSelected]} />
      <Text style={[styles.radioText, isSelected && styles.radioActiveText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const PostModal = ({postId}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const [reply, setReply] = useState('');
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState('0');
  const [tag, setTag] = useState(null)
  const [sortingOption, setSortingOption] = useState('latest'); // Default sorting option is 'latest'

  useEffect(() => {
    const postRef = doc(db, 'Posts', postId);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        setPost({ ...doc.data(), id: doc.id });
      }
    });
    return unsubscribe;
  }, [postId]);

  useEffect(() => {
    const commentsRef = collection(db, 'Posts', postId, 'comments');
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));                 
      setComments(commentsData);
      setCommentsCount(snapshot.docs.length);
    });
    return unsubscribe;
  }, [postId]);

  const getItemCount = useCallback((data) => data.length, []);
  const getItem = useCallback((data, index) => data[index], []);
  const renderVirtualizedItem = useCallback(({ item }) => (
    <CommentSnippet comment={item} setTag={setTag} postId={postId}/>
  ), []);

  // Sorting algorithm: Earliest
  const sortCommentsByEarliest = (commentsData) => {
    return commentsData.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Sorting algorithm: Top (based on likes)
  const sortCommentsByTop = (commentsData) => {
    return commentsData.sort((a, b) => b.likes - a.likes);
  };

  // Sorting algorithm: Latest
  const sortCommentsByLatest = (commentsData) => {
    return commentsData.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Combine the sorting functions and render the comments
  const renderComments = () => {
    let sortedComments;

    switch (sortingOption) {
      case 'earliest':
        sortedComments = sortCommentsByEarliest(comments);
        break;
      case 'top':
        sortedComments = sortCommentsByTop(comments);
        break;
      case 'latest':
      default:
        sortedComments = sortCommentsByLatest(comments);
    }

    return sortedComments.map((comment) => (
      <View key={comment.id}>
        <CommentSnippet comment={comment} setTag={setTag} postId={postId} />
        {/* Fetch and render replies to the user's comment */}
        {comment.userId === userId && (
          <View style={styles.replyContainer}>
            {fetchRepliesToUserComment(comment.id).map((reply) => (
              <CommentSnippet key={reply.id} comment={reply} setTag={setTag} postId={postId} />
            ))}
          </View>
        )}
      </View>
    ));
  };
  
  const showModal = () => { setModalVisible(true);
    Animated.timing(slideAnim, {toValue: 0, duration: 100, useNativeDriver: true, }).start();};
  const hideModal = () => { Animated.timing(slideAnim, { toValue: width, duration: 100, useNativeDriver: true,
    }).start(() => setModalVisible(false));};

  return (
    <View>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>
      <TouchableOpacity onPress={showModal} disabled={modalVisible}>
         <View style={styles.row}>
         <FontAwesome5 name="comment" size={20} color={"#c0c0c0"} />
             <Text style={styles.count}>{commentsCount}</Text>
          </View>
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      > 
    <Animated.View style={[styles.modal,{ transform: [{ translateX: slideAnim }] },]}>    

      <View style={styles.header}>
         {/* <BackArrow/> */}
         <TouchableOpacity onPress={hideModal}>
            <MaterialIcons name="arrow-back" size={25} color="#000" />
           </TouchableOpacity>
         <Text style={styles.post}>Post</Text>
      </View>

      {/* Body */}
     
     
    <View style={styles.body}>
   
    <VirtualizedList
        showsVerticalScrollIndicator={false}
        data={comments}
        renderItem={renderVirtualizedItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        contentContainerStyle={styles.commentsListContent}
        ListHeaderComponent={
          <>
            <Snippet post={post} postId={postId} />
            {/* <YourCustomComponent /> */}
          </>
        }
      />
    </View>
     <CreateComment postId={postId} tag={tag} setTag={setTag}/>
      
    </Animated.View>
    </Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  commentsListContent: {
    flexDirection: "column",
    marginTop: 3, paddingBottom: 50,
  },
  icon:{
    width: 30, height: 30,
  }, 
  count:{
    marginTop: 2, marginLeft: 5,
    color: '#a0a0a0'
  },
  iconcomment: {
    width: 22,
    height: 24,
    
  },
  row:{
    flexDirection: 'row',
  },
  button:{
    paddingTop: 15,
    position: 'absolute', 
    marginLeft: 130,
    paddingRight: 10,
  },
  backdrop: {
  
  },
  modal: {
    left:0, top: 0, bottom: 0, flex: 1,
    alignSelf: 'center', alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    padding: 20,
    position: 'absolute',
     right:0,
  },
  title:{
    width: '90%',
 
  },
  modalTitle:{
    fontWeight: '600', fontSize: 17, padding: 10, paddingTop: 1,
  },
  menu:{
    alignSelf:'flex-end', width: '90%',
 padding: 10,  paddingBottom: 20,
 borderBottomWidth: 1, borderBottomColor: '#c0c0c0' 
  }, 
  menuactive:{
    fontWeight: '500', alignSelf: 'flex-end', color: '#2969b8',
  },
  menunormal:{
    alignSelf: 'flex-end', fontWeight: '500', padding: 5,
  },

header:{
    position: 'absolute',
    flexDirection: 'row',left: 10, padding: 10, 
    paddingVertical: 15, 
    backgroundColor:'white', right: 0, left: 0,
},
post:{
    marginLeft: 10, fontSize: 18, fontWeight: '500', marginTop: 2,
},
attachmentIcon: {
    height: 24,
    width: 24,
    marginLeft: 10,
    marginRight:20, marginTop: 10,
  },
  body:{
    position: 'absolute',
    top: 60, 
    left:0, right: 0,bottom: 50,
    backgroundColor: 'white'

  },
 
});

export default PostModal;
