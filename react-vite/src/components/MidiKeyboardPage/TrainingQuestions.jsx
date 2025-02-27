import { getTonalKeyInfo } from "../../utils/tonalUtils";

const TrainingQuestions = ({ course }) => {
    // Format details using Tonal.js
    const getFormattedDetails = () => {
        if (!course.details_of_course) return '';

        const tonalInfo = getTonalKeyInfo(course.details_of_course);

        // For scales, we can show rich information
        if (course.course_name.toLowerCase().endsWith('scale')) {
            if (tonalInfo.type === 'key') {
                return `${tonalInfo.displayName} - Notes: ${tonalInfo.data.scale.join(', ')}`;
            }
        }

        // For chords or other elements
        return tonalInfo.displayName;
    };

    return (
        <div className="training-questions">
            <h3>{course.course_name}</h3>
            <p>{getFormattedDetails()}</p>
        </div>
    );
};

export default TrainingQuestions;
