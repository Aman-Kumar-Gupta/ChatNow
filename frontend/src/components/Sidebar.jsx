import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/temp'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {
    const {getUsers,users,selectedUser, setSelectedUser,unseenMessages,setUnseenMessages}=useContext(ChatContext);
    const {logout,onlineUsers}=useContext(AuthContext);

    const [input, setInput] = useState(false);
    const navigate= useNavigate();
    //The user search input
    const filteredUsers=input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())):users;

    useEffect(() => {
      getUsers();
    }, [onlineUsers])
    

  return (
    <div className={`bg-gradient-to-b from-slate-800/50 to-slate-900/50 h-full p-6 rounded-l-3xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
        <div className='pb-6'>
            <div className="flex justify-between items-center mb-6">
                <img src={assets.logo} alt="logo" className='max-w-36 filter brightness-0 invert' />
                <div className='relative py-2 group'>
                    <img src={assets.menu_icon} alt="Menu" className='max-h-6 cursor-pointer hover:opacity-80 transition-opacity filter brightness-0 invert' />
                    <div className='absolute top-full right-0 z-20 w-40 p-4 rounded-xl glass border border-slate-600 text-gray-100 hidden group-hover:block shadow-xl'>
                        <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm hover:text-indigo-400 transition-colors py-1'>Edit Profile</p>
                        <hr className='my-2 border-t border-slate-600'/>
                        <p onClick={()=> logout()} className='cursor-pointer text-sm hover:text-red-400 transition-colors py-1'>Logout</p>
                    </div>
                </div>
            </div>
        <div className='bg-slate-700/50 backdrop-blur-sm rounded-2xl flex items-center gap-3 py-4 px-4 border border-slate-600/50 hover:border-slate-500/50 transition-all'>
            <img src={assets.search_icon} alt="search" className='w-4 filter brightness-0 invert opacity-70'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-sm placeholder-slate-400 flex-1' placeholder='Search users...' />
        </div>
        </div>
        <div className='flex flex-col gap-2'>
            {filteredUsers.map((user,i) => (
                <div onClick={()=>{setSelectedUser(user);setUnseenMessages(prev=>({...prev,[user._id]: 0}))}} 
                key={i} className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer max-sm:text-sm hover:bg-slate-700/50 transition-all duration-200 ${selectedUser?._id===user._id ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30' : ''}`}>
                    <div className="relative">
                        <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-12 h-12 rounded-full object-cover border-2 border-slate-600' />
                        {onlineUsers.includes(user._id) && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
                        )}
                    </div>
                    <div className='flex flex-col flex-1 min-w-0'>
                        <p className="font-medium text-slate-100 truncate">{user.fullName}</p>
                        <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-slate-400'}`}>
                            {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    {unseenMessages[user._id]>0 && (
                        <div className='flex-shrink-0'>
                            <span className='text-xs h-6 w-6 flex justify-center items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg'>
                                {unseenMessages[user._id]}
                            </span>
                        </div>
                    )}
                </div>
            ) )}
        </div>
    </div>
  )
}

export default Sidebar