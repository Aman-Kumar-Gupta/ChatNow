import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatDate } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/temp'

const ChatContainer = () => {
    const {messages,selectedUser,setSelectedUser,sendMessage,getMessages}=useContext(ChatContext);
    const {authUser,onlineUsers}=useContext(AuthContext);
    const scrollEnd=useRef()
    const[input,setInput]=useState('')
    //Sending the message
    const handleSendMessage=async (e)=>{
        e.preventDefault();
        if(input.trim()==="") return null;
        await sendMessage({text: input.trim()});
        setInput("");  
    }
    //Sending an image
    const handleSendImage=async (e)=>{
        const file=e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("Select an image file");return;
        }
        const reader=new FileReader();
        reader.onloadend=async ()=>{
            await sendMessage({image: reader.result})
            e.target.value="";
        }
        reader.readAsDataURL(file);
    }
    
    useEffect(() =>{
        if(selectedUser){
            getMessages(selectedUser._id);
        }
    },[selectedUser])
    
    useEffect(() =>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({ behavior: 'smooth'})
        }
    },[messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative bg-gradient-to-b from-slate-800/30 to-slate-900/30'>
        {/* The header part(icon name and i button) */}
        <div className='flex items-center gap-4 py-4 px-6 border-b border-slate-600/50 bg-slate-800/20 backdrop-blur-sm'>
            <div className="relative">
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full object-cover border-2 border-slate-600' />
                {onlineUsers.includes(selectedUser._id) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                )}
            </div>
            <div className='flex-1'>
                <p className='text-lg font-semibold text-slate-100 flex items-center gap-2'>
                    {selectedUser.fullName}
                </p>
                <p className='text-sm text-slate-400'>
                    {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Last seen recently'}
                </p>
            </div>
            <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-6 cursor-pointer hover:opacity-80 transition-opacity filter brightness-0 invert' />
            <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5 cursor-pointer hover:opacity-80 transition-opacity filter brightness-0 invert' />
        </div>
        {/* This is the Chat box */}
        <div className='flex flex-col h-[calc(100%-140px)] overflow-y-scroll p-4 pb-6 gap-4'>
        {messages.map((msg,ind)=>(
            <div key={ind} className={`flex items-end gap-3 ${msg.senderId !=authUser._id ? 'justify-start' : 'justify-end'}`}>
                {msg.image ? (
                    <div className={`max-w-[280px] ${msg.senderId === authUser._id ? 'order-2' : 'order-1'}`}>
                        <img src={msg.image} alt="" className='rounded-2xl shadow-lg border border-slate-600/50' />
                        <p className='text-xs text-slate-500 mt-1 text-center'>{formatDate(msg.createdAt)}</p>
                    </div>
                ) : (
                    <div className={`max-w-[280px] ${msg.senderId === authUser._id ? 'order-2' : 'order-1'}`}>
                        <div className={`p-4 rounded-2xl shadow-lg ${
                            msg.senderId === authUser._id 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                                : 'bg-slate-700/50 text-slate-100 border border-slate-600/50'
                        }`}>
                            <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                        </div>
                        <p className='text-xs text-slate-500 mt-1 text-center'>{formatDate(msg.createdAt)}</p>
                    </div>
                )}
                <div className={`text-center ${msg.senderId === authUser._id ? 'order-1' : 'order-2'}`}>
                    <img src={msg.senderId=== authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt=""  className='w-8 h-8 rounded-full object-cover border-2 border-slate-600'/>
                </div>
            </div>
        ))}
        <div ref={scrollEnd}></div>
        </div>
        {/* the bottom typing part */}
        <div className='absolute bottom-0 left-0 right-0 p-4 bg-slate-800/20 backdrop-blur-sm border-t border-slate-600/50'>
            <div className='flex items-center gap-3'>
                <div className='flex-1 flex items-center bg-slate-700/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-slate-600/50 hover:border-slate-500/50 transition-all'>
                    <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key==='Enter' ? handleSendMessage(e) : null} type="text" placeholder='Type your message...' 
                    className='flex-1 text-sm bg-transparent border-none outline-none text-slate-100 placeholder-slate-400' />
                    <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg, image/jpg' hidden/>
                    <label htmlFor="image" className="cursor-pointer hover:opacity-80 transition-opacity">
                        <img src={assets.gallery_icon} alt="" className='w-5 filter brightness-0 invert opacity-70' />
                    </label>
                </div>
                <button onClick={handleSendMessage} className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200">
                    <img src={assets.send_button} alt="" className='w-5 filter brightness-0 invert' />
                </button>
            </div>
        </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-4 text-slate-400 bg-gradient-to-b from-slate-800/20 to-slate-900/20 max-md:hidden'>
        <div className="p-6 bg-slate-700/30 rounded-full">
            <img src={assets.logo_icon} className='w-16 h-16 filter brightness-0 invert opacity-70' alt="" />
        </div>
        <div className="text-center">
            <p className='text-xl font-semibold text-slate-200 mb-2'>Welcome to QuickChat!</p>
            <p className='text-sm text-slate-400'>Select a conversation to start chatting</p>
        </div>
    </div>
  )
}

export default ChatContainer