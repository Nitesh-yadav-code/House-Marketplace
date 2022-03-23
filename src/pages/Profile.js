import React, { useState } from 'react'
import { getAuth, updateProfile} from "firebase/auth";
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import {useNavigate, Link} from 'react-router-dom'
import { toast } from 'react-toastify';

function Profile() {
const navigate = useNavigate()
  const auth = getAuth()
 const [changeDetails, setchangeDetails] = useState(false) 
const [formData, setFormData] = useState({
  name: auth.currentUser.displayName,
  email: auth.currentUser.email,
})

const {name, email} = formData

 const onLogOut = () =>{
   auth.signOut()
   navigate('/')

 }

 const onSubmit = async()=>{
   try {
    if(auth.currentUser.displayName !== name){
      //update dispaly name in firebase
      await updateProfile(auth.currentUser, {
        displayName: name,
      })

      // update in fireStore
      const userRef =  doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name,
      })

    }
   } catch (error) {
     toast.error('Could not update profile details')
     
   }
 }

 const onChange=(e)=>{
      e.preventDefault()

      setFormData((prevState) =>({
        ...prevState,
        [e.target.id]: e.target.value,

      }))
 }
  return <div className='profile'>
    <header className='profileHeader'>
      <p className="pageHeader">My Profile</p>
      <button type='button' className='logOut' onClick={onLogOut}>Logout</button>
    </header>
    <main>
     <div className="profileDetailsHeader">
       <p className="profileDetailsText">Personal Details</p>
       <p className='changePersonalDetails' onClick={()=>{
         changeDetails && onSubmit()
         setchangeDetails((prevState)=> !prevState)
       }}>{changeDetails? 'done': 'change'}</p>
     </div>
    </main>

    <div className="profileCard">
      <form >
        <input type="text" id='name' className={!changeDetails?'profileName' : 'profileNameActive'} disabled={!changeDetails} autoComplete='on' value={name} onChange = {onChange} />
        <input type="text" id='name' autoComplete='on' className={!changeDetails?'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange = {onChange} />
      </form>
    </div>
  </div>
}

export default Profile