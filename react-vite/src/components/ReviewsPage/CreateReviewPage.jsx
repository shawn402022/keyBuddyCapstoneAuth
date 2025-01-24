import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createReview } from '../../redux/review'
import "./CreateReviews.css";

const CreateReviewPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [reviewContent, setReviewContent] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await dispatch(createReview(reviewContent))
        if (result) {
            setReviewContent(''); // Clear the form
            navigate('/review', { replace: true });
        }
    }

    return (
        <div className="create-review-container">
            <h1 className='review-title'>Create a Review</h1>
            <form className='create-review-form'onSubmit={handleSubmit}>
                <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Write your review here..."
                    required
                />
                <button type="submit">Post Review</button>
            </form>
            <img className="scales"
            src="/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>
    )
}

export default CreateReviewPage
