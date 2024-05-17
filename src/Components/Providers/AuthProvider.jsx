import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import auth from "../../../firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    const createUser = (email, pass) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, pass);
    }

    const setNameAndPhoto = (name, photoUrl) =>{
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoUrl 
        });
    }

    const logIn = (email, pass) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, pass);
    }

    const googleSignIn = () =>{
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () =>{
        setLoading(true);
        return signOut(auth);
    }

    useEffect( () =>{
        const unSubscribe = onAuthStateChanged(auth, currentUser =>{
            setUser(currentUser);
            setLoading(false);
        });

        return () =>{
            unSubscribe();
        }
    } ,[])

    const authInfo = {
        user,
        loading,
        createUser,
        setNameAndPhoto,
        logIn,
        googleSignIn,
        logOut
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

AuthProvider.propTypes = {
    children: PropTypes.node
}