import React,{useState} from 'react'
import { Button } from '@material-ui/core';
import {storage,db} from "../functions/Firebase"


function ImageUpload({username}) {
    const [caption, setCaption]= useState("")
    const [image, setImage] =useState("")
    const [progress, setProgress]= useState("");


    const handleChange = (e) =>{
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    
    const handleUpload = ()=>{
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    
    uploadTask.on(
        "state_changed",
        (snapshot)=>{
            //progress
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalbytes)* 100
            );
            setProgress(progress);
        },
        (error)=>{
            console.log(error);
        },
        () =>{
            //actual function
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url =>{
                //posting to db
                db.collection("posts").add({
                //    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                    caption:caption,
                    imageUrl:url,
                    username: username,
                });

                setProgress(0);
                setCaption("")
                setImage(null);
            });
        }
    )

    }

  return (
    <div>

       
<progress value = {progress} max="100"/>
<input type="text" placeholder='enter the cation here' onChange={event => setCaption(event.target.value)} value={caption}/>
<input type="file" onChange={handleChange}></input>
<Button onClick={handleUpload}>upload</Button>
    </div>
  )
}

export default ImageUpload