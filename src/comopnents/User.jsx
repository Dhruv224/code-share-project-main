import React from 'react';
import Avatar from 'react-avatar';


function User({userName}) {

  return (
    <div className='flex justify-start items-center gap-2'>
        <Avatar name={userName} size={25} round="50px"/>
        <h2 className='text-gray-200 font-bold'>{userName}</h2>
    </div>
  )
}

export default User