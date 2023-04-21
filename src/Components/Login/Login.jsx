import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/store'

export default function Register() {
  const{setIsLogIn}=useContext(userDataContext)
  let navigate=useNavigate()
  const[user,setUser]=useState({
    email:'',
    password:'',
   
  })
  const[signUpError,setSignUpError]=useState('')
  const[isLoading,setIsLoading]=useState(false)
  let getUserData=({target})=>{
   let userData={...user}
    userData[target.name]=target.value
    setUser(userData)
    console.log(userData);
  }
  let login=async(e)=>{
    e.preventDefault()
    setSignUpError('')
    setIsLoading(true)
    let {data}=await axios.post(`https://sticky-note-fe.vercel.app/signin`,user)
    setIsLoading(false)
    if(data.message==='success'){
      localStorage.setItem('token',data.token)
      setIsLogIn(true)
      navigate('/')
    }else{
      setSignUpError(data.message)
    }
  }
  return (
    <>
    <form className='col-md-5 m-auto my-5 py-5 ' onSubmit={login}>
    <h2 className='mb-3'>Login form</h2>

    <div className="input-data my-2">
    <label htmlFor="email">Email:</label>
    <input onChange={getUserData} type="email" className='form-control my-0' name='email' />
    </div>
    <div className="input-data my-2">
    <label htmlFor="pass">Password:</label>
    <input onChange={getUserData} type="password" className='form-control my-0' name='password' />
    </div>
    {signUpError?<div className='alert alert-danger py-1 my-2'>{signUpError}</div>:''}

    <button className={'btn btn-info float-end my-4 '+ (isLoading?'disabled':'')}>{isLoading?<i className="fa-solid fa-spinner fa-spin"></i>:'Login'}
    
    </button>
    <div className="clear-fix"></div>
    </form>
    
    </>
  )
}
