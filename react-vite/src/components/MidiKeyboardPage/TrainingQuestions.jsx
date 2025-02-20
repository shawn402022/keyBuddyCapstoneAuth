

const TrainingQuestions = ({ course }) => {
    return (
        <div className="training-questions">
            <h3>{course.course_name}</h3>
            <p>{course.details_of_course}</p>
            {/* Add more structured content display */}
        </div>
    );
};

export default TrainingQuestions;
