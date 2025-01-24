
import { useNavigate } from 'react-router-dom';

const CreateReviewButton = () => {
    const navigate = useNavigate();

    const handleCreateReviewClick = () => {
        navigate('/review/create');
    };

    return (
        <div>
            <button
                onClick={handleCreateReviewClick}
                className="create-review-button"
            >
            {<p className="create-review-word">Create Review</p>}
            </button>
        </div>
    );
};

export default CreateReviewButton;
