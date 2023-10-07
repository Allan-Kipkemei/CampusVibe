import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

// Create the context
export const AuthContext = createContext();

// Create a provider for components to consume and subscribe to changes
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Set up the Firebase authentication listener
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    // Unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
