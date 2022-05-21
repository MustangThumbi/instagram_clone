import React,{useState,useEffect} from 'react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import './App.css';
import Post from './components/Post';
import {db,registerWithEmailAndPassword,auth,Google} from './functions/Firebase'
import {Modal,Button,Input, makeStyles} from '@material-ui/core';
import { addDoc,collection,getDocs } from "firebase/firestore";


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
    const [openSignin,setOpenSignin]=useState('');
  const [email, setEmail]= useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");
  const [user,setUser]=useState(null);


  useEffect(()=> {
    const getposts= async ()=> {
      const data= await getDocs(postsCollectionRef);
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
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body= (
    <div>
    <h2>check this out niggs</h2>
   
    </div>
  )

  return (
    <div className="App">
      <Modal
     className='signup-modal'
  open={open}
  onClose={handleClose}
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
    
     {/* {header} */}
     <div className='header'>
       <img  className='header_logo' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXm8H7K0a-4nYAwKUu57KI463WaS6BGR7NlFQT5jx05FUdK36UdWbyVyhJaQp6hZAMafM&usqp=CAU'/>
     </div>
      <h1>Lets fucking do this</h1>
      {user ?(
        <Button onClick={()=> auth.signOut()}>Logout</Button>
      ):(
        <Button onClick={() =>setOpen(true)}>Signup</Button>
      )}
      
      {

        posts.map((post) =>(
          <Post username= {post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }

    
     {/* posts */}
     {/* posts */}
     
     

    </div>
  );
}

export default App;
