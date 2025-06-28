import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/authContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  const {login}=useContext(AuthContext);

  const onSubmitHandler=(e)=>{
    e.preventDefault();
    
    // Check if terms are agreed to (only for sign up)
    if(currState === "Sign up" && !agreeToTerms) {
      setShowTermsError(true);
      return;
    }
    
    setShowTermsError(false);
    
    if(currState==="Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }
    login(currState==="Sign up" ? "signup" : "login",{
      fullName,
      email,
      password,
      bio
    })
  }

  const handleTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
    if (e.target.checked) {
      setShowTermsError(false);
    }
  }

  const resetForm = () => {
    setCurrState("Sign up");
    setIsDataSubmitted(false);
    setAgreeToTerms(false);
    setShowTermsError(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  }

  return (
    <div className='min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4'>
      {/* left col */}
      <div className="text-center sm:text-left">
        <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)] filter brightness-0 invert mx-auto sm:mx-0' />
        <div className="mt-6 max-w-md">
          <h1 className="text-3xl font-bold text-slate-100 mb-3">Welcome to QuickChat</h1>
          <p className="text-slate-400 text-lg">Connect with friends and family in real-time with our modern chat platform.</p>
        </div>
      </div>
      {/* right col  */}
      <form onSubmit={onSubmitHandler} className='glass border border-slate-600/50 text-white p-8 flex flex-col gap-6 rounded-2xl shadow-2xl w-full max-w-md'>
        <div className="flex justify-between items-center">
          <h2 className='font-semibold text-2xl text-slate-100'>{currState}</h2>
          {isDataSubmitted && (
            <button type="button" onClick={()=> setIsDataSubmitted(false)} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <img src={assets.arrow_icon} alt="" className='w-5 filter brightness-0 invert' />
            </button>
          )}
        </div>
        
        {currState==="Sign up" && !isDataSubmitted && (
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Full Name</label>
            <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
            type="text" className='w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400' placeholder='Enter your full name' required/>
          </div>
        )}
        
        {!isDataSubmitted && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Email Address</label>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} 
              type="email" placeholder='Enter your email' 
              className='w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400' 
              required/>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Password</label>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} 
              type="password" placeholder='Enter your password' 
              className='w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400' 
              required/>
            </div>
          </>
        )}
        
        {currState=="Sign up" && isDataSubmitted && (
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Bio</label>
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} 
            className='w-full p-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-100 placeholder-slate-400 resize-none' placeholder='Tell us something about yourself...' required></textarea>
          </div>
        )}
        
        {/* Terms and Conditions - Only show for sign up */}
        {currState === "Sign up" && (
          <div className={`space-y-2 ${showTermsError ? 'border-l-4 border-red-500 pl-4' : ''}`}>
            <div className='flex items-start gap-3 text-sm'>
              <input 
                type="checkbox" 
                checked={agreeToTerms}
                onChange={handleTermsChange}
                className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500 mt-0.5 flex-shrink-0"
                required={currState === "Sign up"}
              />
              <div>
                <p className="text-slate-300">
                  I agree to the{' '}
                  <span className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors underline">
                    Terms of Use
                  </span>
                  {' '}&{' '}
                  <span className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors underline">
                    Privacy Policy
                  </span>
                </p>
                {showTermsError && (
                  <p className="text-red-400 text-xs mt-1">You must agree to the terms and conditions to continue</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <button 
          type='submit' 
          className={`py-3 rounded-xl cursor-pointer font-medium transition-all duration-200 ${
            currState === "Sign up" && !agreeToTerms 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
          }`}
          disabled={currState === "Sign up" && !agreeToTerms}
        >
          {currState=== "Sign up" ? "Create Account" : "Login Now"}
        </button>
        
        <div className='flex flex-col gap-2 text-center'>
          {currState === "Sign up" ? (
            <p className='text-sm text-slate-400'>Already have an account? <span 
            onClick={()=>{setCurrState("Login");setIsDataSubmitted(false);setAgreeToTerms(false);setShowTermsError(false)}} className='font-medium text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors'>Login here</span></p>
          ) : (
            <p className='text-sm text-slate-400'>Don't have an account? <span
            onClick={resetForm} className='font-medium text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors'>Sign up here</span></p>
          ) }
        </div>
      </form>
    </div>
  )
}

export default LoginPage
