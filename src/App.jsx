import "./App.css";
import chatAppImg from "/chat.png";
import { auth, googleProvider, db } from "./firebase";
import {
  orderBy,
  doc,
  deleteDoc,
  limit,
  collection,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import "firebase/auth";
import { useState,  useEffect, useRef  } from "react";

const Auth = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <button onClick={signInWithGoogle}> Signin with google</button>
    </div>
  );
};
const logOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
};
function ChatMessages(props) {
  const { text, uid, photoURL, id } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  const deleteMessage = async (e) => {
    e.preventDefault();
    await deleteDoc(doc(db, "messages", id));
  }
  return (
    <div className={`message ${messageClass}`}>
    { 
      auth.currentUser.uid === "stSfc2avyzV39ZFfibSsDdRgmxc2" && 
    <span className="material-symbols-outlined deleteIcon" onClick={deleteMessage}>delete</span>
    }
      <p>{text}</p>
      <img src={photoURL} />
    </div>
  );
}

function App() {
  const q = query(collection(db, "messages"), orderBy("createdAt"), limit(50));
  const [messagesSnapshot] = useCollection(q);
  const messages = messagesSnapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const [user] = useAuthState(auth);
  const [formValue, SetFormValue] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
    SetFormValue("")
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {user ? (
        <>
          <nav>
            <img src={chatAppImg} />
            <button onClick={logOut}> logOut</button>
          </nav>
          {messages?.map((msg) => (
            <ChatMessages key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
          <form onSubmit={sendMessage} className="formSend">
            <input
              type="text"
              value={formValue}
              onChange={(e) => SetFormValue(e.target.value)}
            />
            <button type="submit">send</button>
          </form>
        </>
      ) : (
        <>
          <nav>
            <img src={chatAppImg} />
            <Auth />
          </nav>
        </>
      )}
    </>
  );
}

export default App;
