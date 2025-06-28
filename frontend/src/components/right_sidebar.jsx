import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/chat_context'
import { AuthContext } from '../../context/auth_context';

const RightSideBar = () => {
  const {selectedUser, messages}=useContext(ChatContext);
  const {logout, onlineUsers}=useContext(AuthContext); 
  const [msgImages, setMsgImages]=useState([]);

  //To set all images from messages to a state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg=> msg.image).map(msg=>msg.image)
    )
  },[messages])

  return selectedUser && (
    // top icon and name
    <div className={`bg-gradient-to-b from-slate-800/50 to-slate-900/50 text-white w-full relative overflow-y-scroll rounded-r-3xl ${selectedUser ? "max-md:hidden":""}`}>
      <div className='pt-8 pb-6 flex flex-col items-center gap-4 text-center mx-auto px-6'>
        <div className="relative">
          <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-24 h-24 rounded-full object-cover border-4 border-slate-600 shadow-xl'/>
          {onlineUsers.includes(selectedUser._id) && (
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-slate-800 shadow-lg"></div>
          )}
        </div>
        <div className="space-y-2">
          <h1 className='text-xl font-semibold text-slate-100 flex items-center justify-center gap-2'>
            {selectedUser.fullName}
          </h1>
          <p className='text-sm text-slate-400 leading-relaxed'>{selectedUser.bio || "No bio available"}</p>
        </div>
      </div>
      <hr className='border-slate-600/50 mx-6'/>
      {/* middle part(the images) */}
      <div className='px-6 py-4'>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <p className="text-sm font-medium text-slate-200">Shared Media</p>
        </div>
        <div className='max-h-[300px] overflow-y-scroll'>
          {msgImages.length > 0 ? (
            <div className='grid grid-cols-2 gap-3'>
              {msgImages.map((url,ind)=>
                (<div key={ind} onClick={()=>window.open(url)} className='cursor-pointer group'>
                  <div className="relative overflow-hidden rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all">
                    <img src={url} alt="shared media" className='w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200'/>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>)
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-slate-400">No media shared yet</p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5">
        <button onClick={()=>logout()} className='w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none text-sm font-medium py-3 px-6 rounded-xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSideBar