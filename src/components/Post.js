import React from 'react'
import '../styles/Post.css'
import { Avatar } from '@material-ui/core'



function Post({username, caption, imageUrl}) {
  return (
    <div className='Post'>
        {/* {header->Avatar-> username} */}
        <div className='Post-header'>
        <Avatar alt="Remy Sharp"
        className='Post-avatar'
         src="/static/images/avatar/1.jpg" />

         <h3> {username}</h3>
         </div>
      {/* image post */}
       <img className='Post-image' src={imageUrl}/>
       {/* {username->comments like icons} */}
       <h2 className= 'Post-comment'> <strong>{username}</strong> {caption}</h2>
    </div>
  )
}

export default Post