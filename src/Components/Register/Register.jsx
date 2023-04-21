import axios from 'axios'
import Joi from 'joi'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  let navigate=useNavigate()
  const[user,setUser]=useState({
    first_name:'',
    last_name:'',
    age:'',
    email:'',
    password:'',
   
  })
  const[signUpError,setSignUpError]=useState('')
  const[vlidationErorr,setValidationErorr]=useState('')
  const[isLoading,setIsLoading]=useState(false)
  let getUserData=({target})=>{
   let userData={...user}
    userData[target.name]=target.value
    setUser(userData)
    console.log(userData);
  }
  let register=async(e)=>{
    e.preventDefault()
    setSignUpError('')
    setValidationErorr('')
    setIsLoading(true)
    let validation=validateData()
    if(validation.error===undefined){
      let {data}=await axios.post(`https://sticky-note-fe.vercel.app/signup`,user)
      setIsLoading(false)
      if(data.message==='success'){
        navigate('/login')
      }else{
        setSignUpError(data.message)
    }
  }else{
    setValidationErorr(validation.error.details)
    console.log(validation.error.details);
  }
    }
  
  let validateData=()=>{
    const schema=Joi.object({
      first_name:Joi.string().alphanum().min(2).max(8).required(),
      last_name:Joi.string().alphanum().min(2).max(8).required(),
      age:Joi.number().min(12).required(),
      email:Joi.string().required().email({minDomainSegments:2,tlds:{allow:['com','eg','net']}}),
      password:Joi.string().min(3).max(10).required()
    })
    return schema.validate(user,{abortEarly:false})
  }
  let showValidationErorr=(inputName)=>{
    let errors=vlidationErorr.filter((error)=>error.message.includes(inputName))
    console.log(errors);
     if(errors[0]!==undefined){
      return <div className='alert alert-danger mt-1 py-1'>{errors[0].message}</div>
    }
  }
  return (
    <>
    <form className='col-md-5 m-auto my-5 py-5 ' onSubmit={register}>
    <h2 className='mb-3'>Registeration form</h2>

    <div className="input-data my-2">
    <label htmlFor="first_name">Farst Name:</label>
    <input onChange={getUserData} type="text" className='form-control my-0' name='first_name' />
    {vlidationErorr?showValidationErorr('first_name'):''}
    </div>
    <div className="input-data my-2">
    <label htmlFor="last_name">Last Name:</label>
    <input onChange={getUserData} type="text" className='form-control my-0' name='last_name' />
    {vlidationErorr?showValidationErorr('last_name'):''}
    </div>
    <div className="input-data my-2">
    <label htmlFor="Age">Age:</label>
    <input onChange={getUserData} type="number" className='form-control my-0' name='age' />
    {vlidationErorr?showValidationErorr('age'):''}
   
    </div>
    <div className="input-data my-2">
    <label htmlFor="email">Email:</label>
    <input onChange={getUserData} type="email" className='form-control my-0' name='email' placeholder='ex xxx@.. .com or .eg or .net'/>
    {signUpError?<div className='alert alert-danger py-1 my-2'>{signUpError}</div>:''}
    {vlidationErorr?showValidationErorr('email'):''}
    </div>
    <div className="input-data my-2">
    <label htmlFor="pass">Password:</label>
    <input onChange={getUserData} type="password" className='form-control my-0' name='password' />
    {vlidationErorr?showValidationErorr('password'):''}
    </div>
    <button className={'btn btn-info float-end my-4 '+ (isLoading&&vlidationErorr.length===0?'disabled':'')}>{isLoading&&vlidationErorr.length===0?<i className="fa-solid fa-spinner fa-spin"></i>:'Register'}

    </button>
    <div className="clear-fix"></div>
    </form>
    
    </>
  )
}
