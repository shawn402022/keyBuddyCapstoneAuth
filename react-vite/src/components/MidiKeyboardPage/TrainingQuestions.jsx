
import { formatChordName } from "../../utils/chordUtils";

// Updated formatChordName function to use standardized notation


const TrainingQuestions = ({ course }) => {
    const formattedDetails = formatChordName(course.details_of_course);

    return (
        <div className="training-questions">
            <h3>{course.course_name}</h3>
            <p>{formattedDetails}</p>
        </div>
    );
};

export default TrainingQuestions;
