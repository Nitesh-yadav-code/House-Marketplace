import React, { useState } from 'react'
import {  toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {ReactComponent as ArrowaRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({email:'', password:''})

  const {email, password} = formData

  const navigate = useNavigate();

  const onchange = (e) =>{
      setFormData((prevState) =>({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
  }
  const onSubmit = async(e)=>{
    e.preventDefault()

   try {
    const auth  = getAuth()

    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    if(userCredential.user){
      navigate('/')
    }

   } catch (error) {
     toast.error('Bad User Credential')
   }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className='pageHeader'> Welcome Back</p>
        </header>

        <form onSubmit={onSubmit}>
          <input type="email" className='emailInput' placeholder='Email' id='email' value={email}  onChange={onchange}/>

          <div className="passwordInputDiv">
            <input type={showPassword?'text': 'password'} className='passwordInput' placeholder='Password' id='password' autoComplete='on' value={password} onChange={onchange} />
            <img src={visibilityIcon} alt="showpassword" className='showPassword' onClick={()=>setShowPassword((prevState)=> !prevState) }/>
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          
           </Link>
          
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowaRightIcon width={'34px'} height={'34px'} />
            </button>
          </div>
        </form>
        <OAuth/>

        <Link to='/sign-up' className='registerLink'> Sign Up Instead</Link>
      </div>
    </>
  )
}

export default SignIn