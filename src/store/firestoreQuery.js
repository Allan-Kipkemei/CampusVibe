import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyA7JPJ0jkVgBqd_H46H4ODpCuYt6RHU-zI",
    authDomain: "testampus.firebaseapp.com",
    projectId: "testampus",
    storageBucket: "testampus.appspot.com",
    messagingSenderId: "175187994196",
    appId: "1:175187994196:web:df2f335c5922e2ddd1afc1",
    measurementId: "G-BB8S9ZJNWL"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsRef = collection(db, 'posts');


function PostsFetcher() {
  const dispatch = useDispatch();
  const campus = useSelector(state => state.campus);
  const currentTimestamp = new Date();
  const batchNumber = useSelector(getBatchNumber);

  useEffect(() => {
    console.log("Fetching posts for batch number:", batchNumber);
    const startIndex = (batchNumber * 10) + 1;
    console.log("Fetching posts starting from index:", startIndex);

    const fetchPosts = async () => {
      let posts;
      try {
        const postsQuery = query(postsRef, where('campus', '==', campus), orderBy('time', 'desc'), orderBy('popularity', 'desc'), startAt(startIndex), limit(10));
        const querySnapshot = await postsQuery.get();
        posts = querySnapshot.docs.map(doc => {
          const post = doc.data();
          const time = (currentTimestamp - post.time.toDate()) / (60 * 60 * 1000); //  time in hours
          const popularity = (post.likes/2 + post.comments - post.dislikes/2); // calculate the popularity
          return {...post, id: doc.id, time, popularity}; 
        });

        console.log("Fetched posts:", posts);
        setPosts

        let lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
        while (lastVisible) {
          const nextQuerySnapshot = await query(postsRef, where('campus', '==', campus), orderBy('time', 'desc'), orderBy('popularity', 'desc'), startAfter(lastVisible), limit(10)).get();
          if (!nextQuerySnapshot.empty) {
            const nextPosts = nextQuerySnapshot.docs.map(doc => {
              const post = doc.data();
              const time = (currentTimestamp - post.time.toDate()) / (60 * 60 * 1000); 
              const popularity = (post.likes/2 + post.comments - post.dislikes/2); 
              return {...post, id: doc.id, time, popularity};
            });
            posts.push(...nextPosts); 
            lastVisible = nextQuerySnapshot.docs[nextQuerySnapshot.docs.length-1];
          } else {
            lastVisible = null; 
          }
        }
      } catch (error) {
        console.error('Error getting posts:', error);
      }
    }

   fetchPosts()

    return () => {
      // Cleanup code if needed
    };
  }, [batchNumber, campus, currentTimestamp, dispatch]);

  return null;
}

export default PostsFetcher;
