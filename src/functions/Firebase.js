import {GoogleAuthProvider,
    sendPasswordResetEmail,
    getAuth,signOut,signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
 } from "firebase/auth";
 import { getStorage, ref } from "firebase/storage"
 import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

    import {getFirestore,query,getDocs,
        collection, where, 
        addDoc,
     } from "firebase/firestore";

    const firebaseConfig = {
  apiKey: "AIzaSyAPc3LPIogSvgBTjzwsmXkJq1abv2WSWp8",
  authDomain: "instagram-clone-d5a7a.firebaseapp.com",
  databaseURL: "https://instagram-clone-d5a7a-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-d5a7a",
  storageBucket: "instagram-clone-d5a7a.appspot.com",
  messagingSenderId: "46915847354",
  appId: "1:46915847354:web:fe19b10af0463f2c6e2e83",
  measurementId: "G-NBMH3WM6G9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage= getStorage();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const Google = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


  const logout = () => {
    signOut(auth);
  };

  export {
    auth,
    db,
    storage,

    Google,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
  };