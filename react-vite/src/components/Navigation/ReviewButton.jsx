import { useNavigate } from 'react-router-dom';

const ReviewButton = () => {
    const navigate = useNavigate();

    const handleReviewClick = () => {
        navigate('/review');
    };

    return (
        <div>
            <button
                onClick={handleReviewClick}
                className="review-button"
            >
            <p className="review-word">Review</p>
            </button>
        </div>
    );
};

export default ReviewButton;
