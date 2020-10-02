import React, { FunctionComponent, useState, useRef } from "react";
import firebase, { User } from "firebase/app";
import { Grid, Container, TextField } from "@material-ui/core";
import ChatMessage from "./ChatMessage";
import { useCollectionData } from "react-firebase-hooks/firestore";

export type FirestoreMessage = {
  id: string;
  text: string;
  uid: string;
  photoURL: string;
};

interface Props {
  currentUser: User;
  firestore: firebase.firestore.Firestore;
}

const ChatRoom: FunctionComponent<Props> = ({ currentUser, firestore }) => {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(25);
  const dummy = useRef<HTMLDivElement>(null);
  const [messages] = useCollectionData<FirestoreMessage>(query, {
    idField: "id",
  });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { uid, photoURL } = currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    if (dummy?.current !== null) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Container maxWidth="sm" className="ChatRoom">
      <Grid container direction="column" justify="center" alignItems="center">
        <div className="messages">
          {messages &&
            messages
              .slice(0)
              .reverse()
              .map((message) => {
                const { id } = message;
                return (
                  <ChatMessage
                    key={id}
                    currentUser={currentUser}
                    message={message}
                  />
                );
              })}
          <div ref={dummy} />
        </div>
        <div>
          <form onSubmit={sendMessage}>
            <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
            />
            <button type="submit">
              <span role="img" aria-label="ghost">
                👻
              </span>
            </button>
          </form>
        </div>
      </Grid>
    </Container>
  );
};

export default ChatRoom;
