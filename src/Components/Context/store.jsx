import { createContext, useState } from "react";

export let userDataContext=createContext('')
export default function CreateContextprovider(props){
    const[isLogin,setIsLogIn]=useState(false)
    return <userDataContext.Provider value={{isLogin,setIsLogIn}}>
 {props.children}
    </userDataContext.Provider>
}