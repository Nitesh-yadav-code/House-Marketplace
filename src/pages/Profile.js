import React, { useEffect, useState } from 'react'
import { getAuth, updateProfile} from "firebase/auth";
import { updateDoc, doc, collection, query, where, getDocs,orderBy, deleteDoc, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import {useNavigate, Link} from 'react-router-dom'
import { toast } from 'react-toastify'
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import { async } from '@firebase/util';
import ListingItem from '../components/ListingItem';


function Profile() {
const navigate = useNavigate()
  const auth = getAuth()
 const [changeDetails, setchangeDetails] = useState(false) 
 const [listings, setListings] = useState(null)
 const [loading, setLoading] = useState(true)
const [formData, setFormData] = useState({
  name: auth.currentUser.displayName,
  email: auth.currentUser.email,
})

const {name, email} = formData

useEffect(() => {
  const fetchUserListings = async () => {
    const listingsRef = collection(db, 'listing')

    const q = query(
      listingsRef,
      where('useRef', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    )

    const querySnap = await getDocs(q)

    let listings = []

    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    setListings(listings)
    setLoading(false)
  }

  fetchUserListings()
}, [auth.currentUser.uid])



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

 const onDelete = async(listingId)=>{

  if(window.confirm('Are You sure you want to delete?')){
    await deleteDoc(doc(db, 'listing', listingId))

    const updatedListing = listings.filter(
      (listing)=> listing.id !== listingId
    )

    setListings(updatedListing)
    toast.success('Successfully deleted listing')
  }

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
   

    <div className="profileCard">
      <form >
        <input type="text" id='name' className={!changeDetails?'profileName' : 'profileNameActive'} disabled={!changeDetails} autoComplete='on' value={name} onChange = {onChange} />
        <input type="email" id='email' autoComplete='on' className={!changeDetails?'profileEmail' : 'profileEmailActive'} disabled={true} value={email} onChange = {onChange} />
      </form>
    </div>
    <Link to= '/create-listing'  className='createListing' >
      <img src={homeIcon} alt="home" />
      <p>Sell or rent your home</p>
      <img src={arrowRightIcon} alt="arrowRight" />
    </Link>

    {!loading && listings?.length > 0 && (
      <>
      <p className="listingText">Your Listings</p>
      <ul className="listingList">
        {listings.map((listing)=>(
          <ListingItem  key={listing.id} listing={listing.data} id={listing.id} onDelete={()=>onDelete(listing.id)} />
        ))}
      </ul>
      </>
    )}
    </main>
  </div>
}

export default Profile