import "./App.css";
import "firebase/firestore";
import "firebase/auth";

import React, { FunctionComponent } from "react";

import ChatRoom from "./Chat/ChatRoom";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

firebase.initializeApp({
  apiKey: "AIzaSyAv_hoV7azjViL-dbyy0xCjAM-cGY_6o8g",
  authDomain: "secretchat-a79d8.firebaseapp.com",
  databaseURL: "https://secretchat-a79d8.firebaseio.com",
  projectId: "secretchat-a79d8",
  storageBucket: "secretchat-a79d8.appspot.com",
  messagingSenderId: "139879084121",
  appId: "1:139879084121:web:b7366cb707d1f637e04148",
  measurementId: "G-3F318NLYZX",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>The super secret chat room</h1>
      </header>
      <section>
        {user && auth.currentUser ? (
          <ChatRoom currentUser={auth.currentUser} firestore={firestore} />
        ) : (
          <SignIn />
        )}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

interface SignOutProps {
  auth: firebase.auth.Auth;
}

export const SignOut: FunctionComponent<SignOutProps> = ({ auth }) => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

export default App;
