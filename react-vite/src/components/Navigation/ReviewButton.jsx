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
            {<img className="review-word"
                src="../dist/images/review-word.png"
                alt="Home" />}
            </button>
        </div>
    );
};

export default ReviewButton;
