


const TrainingQuestions = ({ course }) => {
    // Function to transform chord notation in text
    const formatChordsWithMajorSuffix = (text) => {
        if (!text) return '';

        // Regular expression to find chord notations
        // This looks for patterns like 'C', 'G#', 'Bb', etc. that aren't followed by any chord quality
        return text.replace(/\b([A-G][#b]?)(?!\w)/g, '$1M');
    };

    const formattedDetails = formatChordsWithMajorSuffix(course.details_of_course);

    return (
        <div className="training-questions">
            <h3>{course.course_name}</h3>
            <p>{formattedDetails}</p>
            {/* Add more structured content display */}
        </div>
    );
};

export default TrainingQuestions;
