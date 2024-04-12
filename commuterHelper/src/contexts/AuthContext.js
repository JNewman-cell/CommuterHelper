import React, { useContext, useState, useEffect } from "react"
import { auth, googleAuthProvider } from "../firebase"
import { browserPopupRedirectResolver } from "firebase/auth"
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut,
  sendPasswordResetEmail, updateEmail, updatePassword
} from "firebase/auth"
import { collection, doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"

const AuthContext = React.createContext()

function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Create a Firestore reference to the user's document in the 'users' collection
      const userDocRef = doc(db, 'users', user.uid);
  
      // Check if the user document already exists
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        // The user document already exists
        console.log('User document already exists:', userDocSnapshot.data());
      } else {
        // Set information for the user
        const userData = {
          email: user.email,
          // Add other user-specific data as needed
        };
  
        try {
          await setDoc(userDocRef, userData, { merge: true });
          console.log('User data updated successfully');
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      }
  
      return userCredential;
    } catch (error) {
      throw error;
    }

  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);

      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);

      // Check if the user document already exists
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // The user document already exists
        console.log('User document already exists:', userDocSnapshot.data());
      } else {
        // Set information for the user
        const userData = {
          displayName: user.displayName,
          email: user.email,
          // Add other user-specific data as needed
        };
  
        try {
          await setDoc(userDocRef, userData, { merge: true });
          // The setDoc operation has completed successfully
          console.log('User data updated successfully');
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function updateEmail(email) {
    return updateEmail(currentUser, email)
  }

  function updatePassword(password) {
    return updatePassword(currentUser, password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export {useAuth, AuthProvider};