
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
            {<img className="create-review-word"
                src="../dist/images/createreview-word.png"
                alt="Home" />}
            </button>
        </div>
    );
};

export default CreateReviewButton;
