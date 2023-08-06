import "./App.css";
import chatAppImg from "/chat.png";
import { auth, googleProvider, db } from "./firebase";
import {
  orderBy,
  doc,
  limit,
  collection,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "firebase/auth";
import { useState } from "react";

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
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
      <img src={photoURL} />
    </div>
  );
}

function App() {
  const q = query(collection(db, "messages"), orderBy("createdAt"), limit(20));
  const [messages] = useCollectionData(q, { isField: "id" });
  const [user] = useAuthState(auth);
  const [formValue, SetFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(formValue);
    const { uid, photoURL } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
  };

  console.log("run");
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
