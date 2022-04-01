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
import Listing from '../components/Listing'

function Category() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

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


        const list = []
        querySnap.forEach((doc) => {
          return list.push({
            id: doc.id,
            data : doc.data()
          })
        })
        setListings(list)
        setLoading(false)
     
     
      } catch (error) {
        toast.error('Could not fetch stings')
      }
    }
   
    fetchListings()
  }, [params.categoryName])
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
              <>
                <Listing  key={listing.id} listing={listing.data} id={listing.id} />
              </>
               
      ))}
     
          </ul>
        </main>
      </>) : (<p> No listing for {params.categoryName}</p>) }
    </div>
  )
}


export default Category
