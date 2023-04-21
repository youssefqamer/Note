import axios from 'axios';
import Joi from 'joi';
import jwtDecode from 'jwt-decode';
import React from 'react'
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Home() {
  let notedId;
  let decoded=jwtDecode(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [getAllNotes, setgetAllNotes] = useState([])
  console.log(getAllNotes);
  const [inputValue, setInputValue] = useState({
    title:'',
    desc:'',
  })
 let getNotes=async()=>{
  setLoading(true)
    let {data}=await axios.post(`https://sticky-note-fe.vercel.app/getUserNotes`,{
      token:localStorage.getItem('token'),
      userID:decoded._id
    })
    if(data.message==='success'){
      setgetAllNotes(data.Notes)
    } 
    if(data.message==='no notes found'){
      setgetAllNotes([])
    }
    setLoading(false)
 }
useEffect(() => {
  getNotes()
}, [])
let getInputValue=({target})=>{
  let myNotes={...inputValue}
  myNotes[target.name]=target.value
  setInputValue(myNotes)
}
// add
let addNote=async(e)=>{
  e.preventDefault()
  let validationResponse= validateData()
  if (validationResponse.error) {
    Swal.fire({
      title: 'Inputs are not allowed to be empty',
      confirmButtonText: 'Ok',
    })
  }else{
    let {data}=await axios.post(`https://sticky-note-fe.vercel.app/addNote`,{
      ...inputValue,
      citizenID:decoded._id,
      token:localStorage.getItem('token')
    })
    Swal.fire('Added!', '', 'success').then(()=>{
          getNotes()
        })
  }
  inputValue.title=''
  inputValue.desc=''
}
// delete
let deleteNote=async(noteId)=>{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
     (async()=>{
       let {data}=await axios.delete(`https://sticky-note-fe.vercel.app/deleteNote`,{
         data:{
          NoteID:noteId,
          token:localStorage.getItem('token')
         }
        })
      })()
      swalWithBootstrapButtons.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      ).then(()=>{
        getNotes()
      })
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelled',
        'Your imaginary file is safe :)',
        'error'
      )
    }
  })
 
} 
// update
let updateNote=async()=>{
    let {data}=await axios.put(`https://sticky-note-fe.vercel.app/updateNote`,{
      token:localStorage.getItem('token'),
     title:document.querySelector('#exampleModal1 input').value,
     desc:document.querySelector('#exampleModal1 textarea').value,
      NoteID:notedId,
    })
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success').then(()=>{
          getNotes()
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
}
let returnDataToInput=(index)=>{
document.querySelector('#exampleModal1 input').value=getAllNotes[index].title
document.querySelector('#exampleModal1 textarea').value=getAllNotes[index].desc
   notedId=getAllNotes[index]._id
}
// validation
let validateData=()=>{
  const schema=Joi.object({
    title:Joi.string().required(),
    desc:Joi.string().required(),
  })
  return schema.validate(inputValue,{abortEarly:false})
}
  return (
    <>
    
<div className='my-5 py-5'>
  <button type="button" className="btn btn-primary d-block ms-auto  " data-bs-toggle="modal" data-bs-target="#exampleModal">
   Add New
  </button>
  {/* Modal */}
  {/* Add */}
  <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
   <form>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
            <input  onChange={getInputValue} name="title" value={inputValue.title} type="text" placeholder='type title' className='form-control'  required/>
            <textarea  onChange={getInputValue} name="desc" value={inputValue.desc} cols="30" rows="10" className='form-control my-1' placeholder='type your note' required></textarea>
        </div>
        <div className="modal-footer">
          <button type='button' className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
          <button className="btn btn-primary" data-bs-dismiss="modal" onClick={addNote}>Add</button>
        </div>
      </div>
    </div>
    </form>
  </div>
  {/* update */}
 
  <div className="modal fade" id="exampleModal1" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
            <input name="title" type="text" placeholder='type title'  className='form-control' required/>
        <textarea name="desc"  cols="30" rows="10" className='form-control my-1' placeholder='type your note' required></textarea>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={updateNote}>Save changes</button>
        </div>
      </div>
    </div>
  </div>
  {/* note */}
  <div className="row mt-4">
    
      {getAllNotes.map((note,index)=>{
    return  <div className="col-md-4 " key={index}>
        <div className="note bg-warning  shadow p-2 mb-3 rounded-2">
        <div className='d-flex justify-content-between mb-2'>
          <h3>{note.title}</h3>
          <div>
          <a data-bs-toggle="modal" data-bs-target="#exampleModal1"><i className="fa-solid fa-pen-to-square px-2 fs-5" onClick={()=>returnDataToInput(index)}/></a>
    <a><i className="fa-solid fa-trash-can px-2 fs-5" onClick={()=>deleteNote(note._id)}/></a>
          </div>
        </div>
        <p>{note.desc}</p>
        </div>
      </div>
   })}

{loading?<div className='d-flex justify-content-center align-items-center'>
<div className="loader"></div></div>:''}
    </div>
    
  </div>
{getAllNotes.length===0&& !loading?
<div className='d-flex justify-content-center align-items-center my-5 py-5'>
<h1 className='text-white'>No notes found</h1>
  </div>
:''}
    </>
  )
}

