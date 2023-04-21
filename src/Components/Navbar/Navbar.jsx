import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode';
import { userDataContext } from './../Context/store';
export default function Navbar() {
  const[userName,setUserName]=useState('')
    const{isLogin,setIsLogIn}=useContext(userDataContext)
  let logOut=()=>{
    setIsLogIn(false)
    localStorage.removeItem('token')
  }
  useEffect(() => {
    if(localStorage.getItem('token')){
      let decoded=jwtDecode(localStorage.getItem('token'))
     let userData=decoded.first_name
     setUserName(userData)
     setIsLogIn(true)
    }
  }, [isLogin])
  
  return (
   <>
<nav className="navbar navbar-expand-lg navbar-light shadow ">
  <div className="container ">
    <a className="navbar-brand text-info " >
    <i className="fa-solid fa-note-sticky px-2 "></i>
      Note</a>
    <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    {isLogin?<>
          <div className="collapse navbar-collapse" id="collapsibleNavId">
      <ul className="navbar-nav me-auto mt-2 mt-lg-0">
        <li className="nav-item ">
          <Link className="nav-link text-info  fs-5" to=''>Home</Link>
        </li>
        
      </ul>
    </div>
    <div className="collapse navbar-collapse" id="collapsibleNavId">
      <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
        <li className="nav-item">
          <Link className="nav-link text-info fs-5" to="login" onClick={logOut}>Logout</Link>
        </li>
        <li className="nav-item">
          {isLogin?<Link className="nav-link text-info fs-5" >{userName}</Link>:''}
        </li>
      </ul>
    </div>
        </>:<div className="collapse navbar-collapse" id="collapsibleNavId">
      <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
        <li className="nav-item">
          <Link className="nav-link text-info fs-5" to='register'>Register</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-info fs-5" to="login">Login</Link>
        </li>
      </ul>
    </div>}
  </div>
</nav>
   </>
  )
}
