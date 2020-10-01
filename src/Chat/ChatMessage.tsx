import { FirestoreMessage } from "./ChatRoom";
import { FunctionComponent } from "react";
import React from "react";
import { User } from "firebase";

interface Props {
  currentUser: User;
  message: FirestoreMessage;
}

const ChatMessage: FunctionComponent<Props> = ({ currentUser, message }) => {
  const { text, uid, photoURL } = message;

  const messageClass = uid === currentUser?.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
};

export default ChatMessage;
