import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/authContext';

const ProfilePage = () => {

  const {authUser,updateProfile}=useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null)
  const navigate=useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({name,bio});
      navigate('/');return;
    }
    const reader= new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onloadend=async ()=>{
      const base64Image=reader.result;
      await updateProfile({profilePic: base64Image,fullName: name,bio})
      navigate('/');
    }
  }
  
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl glass border border-slate-600/50 flex items-center justify-between max-sm:flex-col-reverse rounded-2xl shadow-2xl overflow-hidden'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-8 flex-1'>
          <div className="space-y-2">
            <h3 className='text-2xl font-semibold text-slate-100'>Profile Details</h3>
            <p className="text-slate-400">Update your profile information and photo</p>
          </div>
          
          <div className="space-y-4">
            <label htmlFor="avatar" className='flex items-center gap-4 cursor-pointer p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors'>
              <input onChange={(e)=> setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg'  hidden/>
              <div className="relative">
                <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" 
                className={`w-16 h-16 rounded-full object-cover border-2 border-slate-600 ${selectedImg && 'ring-2 ring-indigo-500'}`}/>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-slate-100 font-medium">Upload Profile Picture</p>
                <p className="text-sm text-slate-400">Click to select an image</p>
              </div>
            </label>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Full Name</label>
              <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Enter your full name' 
              className='w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400' required/>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Bio</label>
              <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Tell us something about yourself...' 
              className='w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400 resize-none' rows={4} required></textarea>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className='flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl text-lg font-medium cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200'>
              Save Changes
            </button>
            <button type="button" onClick={() => navigate('/')} className='px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/70 transition-colors'>
              Cancel
            </button>
          </div>
        </form>
        
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-800/50 to-slate-900/50 max-sm:w-full">
          <div className="relative mb-6">
            <img className={`w-48 h-48 rounded-full object-cover border-4 border-slate-600 shadow-2xl ${selectedImg && 'ring-4 ring-indigo-500'}`}
            src={authUser.profilePic || assets.logo_icon} alt="Profile" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-100 mb-2">{authUser.fullName}</h2>
          <p className="text-slate-400 text-center max-w-xs">{authUser.bio || "No bio available"}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
