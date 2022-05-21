import React,{useState,useEffect} from 'react'
import { getAuth,signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import './App.css';
import Post from './components/Post';
import {db,registerWithEmailAndPassword,auth,Google} from './functions/Firebase'
import {Modal,Button,Input, makeStyles} from '@material-ui/core';
import { addDoc,collection,getDocs } from "firebase/firestore";
import ImageUpload from './components/ImageUpload';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}




const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const[posts, setPosts]= useState([]);
   const postsCollectionRef= collection(db, "posts");
   const [open, setOpen]=useState(false);
   const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [openSignIn,setOpenSignIn]=useState("");
  const [email, setEmail]= useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");
  const [user,setUser]=useState(null);
  const [openSignUp, setOpenSignUp]= useState("");


  useEffect(()=> {
    const getposts= async ()=> {
      const data= await getDocs.orderBy('timestamp','desc')(postsCollectionRef);
      setPosts(data.docs.map((doc)=>({...doc.data(),id:doc.id})))
    };
    getposts();
  },[]);
    // db.collection('posts').onSnapshot(snapshot=>{
    //   setPosts(snapshot.docs.map(doc=>({ 
    //     id:doc.id,
    //     data:doc.data()
    //   })));
    // })
  // },[])


// function getProfilePicUrl() {
//   return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
// }


// Returns true if a user is signed-in.
// function isUserSignedIn() {
//   return !!getAuth().currentUser;
// }


useEffect(()=>{
 const unsubscribe=auth.onAuthStateChanged((authUser)=>{
   if(authUser){
     console.log(authUser);
     setUser(authUser);
   }else{
     setUser(null);
   }
 })
 return()=>{
   unsubscribe();
 }
},[user,username]);



  const signup=async(event)=>{
    event.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        username,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
      setOpenSignUp(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 


  //signing in function
  const signIn= async(event)=>{
    event.preventDefault();

     try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
      setOpenSignIn(false);
  };

  

  return (
    <div className="App">
    <div classname='upload'>
     {user?.displayName ? (
         <ImageUpload username={user.displayName}/>

      ):(
        <h3>You have to login to upload</h3>
            )}
   
</div>
        {/* This is a modal */}
      <Modal
     className='signup-modal'
  open={openSignUp}
  onClose={() =>setOpenSignUp(false)}
  aria-labelledby="simple-modal-title"
  aria-describedby="simple-modal-description"
>
   <form className='signup-form'>
 <center> 
    <img className='signup-logo' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXm8H7K0a-4nYAwKUu57KI463WaS6BGR7NlFQT5jx05FUdK36UdWbyVyhJaQp6hZAMafM&usqp=CAU'/>
   </center>
   <Input
   placeholder="username"
   type="text"
  className='signup-input'
   value={username}
   onChange={(e)=> setUsername(e.target.value)}/>


   <Input
   placeholder="email"
   type="text"
   className='signup-input'
   value={email}
   onChange={(e)=> setEmail(e.target.value)}/>

   <Input
   placeholder="password"
   type="text"
   value={password}
    className='signup-input'
   onChange={(e)=> setPassword(e.target.value)}/>
   <Button className='signup-btn' type="submit" onClick={signup}>signup</Button>
   <Button className='google' type="submit" onClick={Google}>Google</Button>
</form>

  
  </Modal>


  <Modal
     className='signup-modal'
  open={openSignIn}
  onClose={()=> setOpenSignIn(false)}
  aria-labelledby="simple-modal-title"
  aria-describedby="simple-modal-description"
>
   <form className='signup-form'>
 <center> 
    <img className='signup-logo' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXm8H7K0a-4nYAwKUu57KI463WaS6BGR7NlFQT5jx05FUdK36UdWbyVyhJaQp6hZAMafM&usqp=CAU'/>
   </center>
   

   <Input
   placeholder="email"
   type="text"
   className='signup-input'
   value={email}
   onChange={(e)=> setEmail(e.target.value)}/>

   <Input
   placeholder="password"
   type="text"
   value={password}
    className='signup-input'
   onChange={(e)=> setPassword(e.target.value)}/>
   <Button className='signup-btn' type="submit" onClick={signIn}>signin</Button>
   <Button className='google' type="submit" onClick={Google}>Google</Button>
</form>

  
  </Modal>
    
     {/* {header} */}
     <div className='header'>
       <img  className='header_logo' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXm8H7K0a-4nYAwKUu57KI463WaS6BGR7NlFQT5jx05FUdK36UdWbyVyhJaQp6hZAMafM&usqp=CAU'/>
     </div>
      <h1>Lets fucking do this</h1>
      {user ?(
        <Button onClick={()=> auth.signOut()}>Logout</Button>
      ):(<div className='signs-part'>
        <Button onClick={() =>setOpenSignIn(true)}>Signin</Button>
        
        <Button onClick={() =>setOpenSignUp(true)}>Signup</Button>
        </div>
      )}
      
      {

        posts.map((post) =>(
          <Post username= {post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }

    
    
     
     
     

    </div>
  );
}

export default App;
