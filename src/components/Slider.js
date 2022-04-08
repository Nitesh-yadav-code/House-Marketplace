import { useState, useEffect } from 'react'
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import Spinner from './Spinner'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'
import { useNavigate } from 'react-router-dom';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {

    const [loading, setLoading] = useState(true)
    const [listing, setListing] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db, 'listing')
            const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
            const docSnap = await getDocs(q)

            let listings = []
            docSnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListing(listings)
            setLoading(false)
        }
        fetchListings()
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (listing.length === 0) {
        return <></>
    }

    return (
        <div>

            {listing && (
                <>
                    <p className='exploreHeading'>Recommended</p>
                    <Swiper slidesPerView={1} pagination={{ clickable: true }} >
                        {listing.map(({ data, id }) => (
                            <SwiperSlide key={id} onClick={() => { navigate(`/category/${data.type}/${id}`) }} >
                                <div className="swiperSlideDiv" style={{ background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} >

                                    <p className='swiperSlideText'>{data.name}</p>
                                    <p className='swiperSlidePrice'>
                                        ${data.discountedPrice ?? data.regularPrice}{' '}
                                        {data.type === 'rent' && '/ month'}
                                    </p>

                                </div>

                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </div>
    )
}

export default Slider