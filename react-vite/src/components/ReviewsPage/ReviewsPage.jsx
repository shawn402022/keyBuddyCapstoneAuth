import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReviews } from '../../redux/review'
import CreateReviewButton from '../Navigation/CreateReviewButton'

const ReviewsPage = () => {
    const dispatch = useDispatch()
    const reviews = useSelector(state => Object.values(state.review))

    useEffect(() => {
        dispatch(getReviews())
    }, [dispatch])

    return (
        <div className="reviews-container">
            <div className="reviews-header">
                <h1>Community Reviews</h1>
                <CreateReviewButton />
            </div>
            <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                        <h3>{review.reviewer_name}</h3>
                        <p>{review.review_content}</p>
                    </div>
                ))}
            </div>
            <img className="scales"
            src="/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>
    )
}

export default ReviewsPage
