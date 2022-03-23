import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import {db} from '../firebase.config.js'
import {ReactComponent as ArrowaRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth.js';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({name: '', email:'', password:''})

  const {name, email, password} = formData

  const navigate = useNavigate();

  const onchange = (e) =>{
      setFormData((prevState) =>({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
  }

  const onSubmit = async (e) =>{
      e.preventDefault()
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formDataCopy)

         navigate('/')

    } catch (error) {
      toast.error('Something went with registration')
    }

  }
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className='pageHeader'> Welcome Back</p>
        </header>

        <form onSubmit={onSubmit}>
          <input type="text" className='nameInput' placeholder='Name' id='name' value={name}  onChange={onchange}/>

          <input type="email" className='emailInput' placeholder='Email' id='email' value={email}  onChange={onchange}/>

          <div className="passwordInputDiv">
            <input type={showPassword?'text': 'password'} className='passwordInput' placeholder='Password' id='password' value={password} onChange={onchange} />
            <img src={visibilityIcon} alt="showpassword" className='showPassword' onClick={()=>setShowPassword((prevState)=> !prevState) }/>
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          
           </Link>
          
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowaRightIcon width={'34px'} height={'34px'} />
            </button>
          </div>
        </form>
        <OAuth />

        <Link to='/sign-in' className='registerLink'> Sign In Instead</Link>
      </div>
    </>
  )
}

export default SignUp