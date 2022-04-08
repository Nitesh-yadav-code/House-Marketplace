import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchListing, setLastFetchListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listing')

        // Create a query
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        )
        
        // Execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length-1]
          setLastFetchListing(lastVisible)

        const list = []
        querySnap.forEach((doc) => {
          return list.push({
            id: doc.id,
            data : doc.data()
          })
        })
        setListings(list)
        // console.log(list); 
        setLoading(false)
     
     
      } catch (error) {
        toast.error('Could not fetch stings')
      }
    }
   
    fetchListings()
  }, [params.categoryName])


  //Pagination/ Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listing')

      // Create a query
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListing),
        limit(10)
      )
      
      // Execute query
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length-1]
        setLastFetchListing(lastVisible)

      const list = []
      querySnap.forEach((doc) => {
        return list.push({
          id: doc.id,
          data : doc.data()
        })
      })
      setListings((prevState)=>[...prevState, ...list] )
      // console.log(list); 
      setLoading(false)
   
   
    } catch (error) {
      toast.error('Could not fetch stings')
    }
  }
 


  return (
    <div className='category'>
      <header>
        <p className="pageHeader">
      {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}

        </p>
      </header>
      {loading ? (<Spinner/> ): listings && listings.length > 0 ?
      (<>
        <main>
          <ul className="categoryListings">
            {listings.map((listing)=>(
              // console.log(listing.data)
              <>
                <ListingItem  key={listing.id} listing={listing.data} id={listing.id} />
              </>
               
      ))}
     
          </ul>
        </main>
        <br />
        <br />
        {lastFetchListing && (
          <p className="loadMore" onClick={onFetchMoreListings} >Load More</p>
        )}
      </>) : (<p> No listing for {params.categoryName}</p>) }
    </div>
  )
}


export default Category

