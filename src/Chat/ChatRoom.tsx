import React, { FunctionComponent, useState } from "react";
import firebase, { User } from "firebase/app";

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
  const query = messagesRef.orderBy("createdAt").limit(25);

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
  };

  return (
    <>
      <div>
        {messages &&
          messages.map((message) => {
            const { id } = message;
            return (
              <ChatMessage
                key={id}
                currentUser={currentUser}
                message={message}
              />
            );
          })}
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">👻</button>
      </form>
    </>
  );
};

export default ChatRoom;
