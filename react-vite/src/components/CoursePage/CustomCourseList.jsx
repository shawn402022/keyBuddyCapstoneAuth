import { keys } from './CourseData';
import CustomCourseTile from './CustomCourseTile';

const CustomCourseListItems = () => {
  return (
    <div className='custom-course-list'>
        <h1>Custom Course List Items</h1>
        <div className='custom-course-grid'>
        {keys.map((keyData, index) => {
            // Handle different key types
            let keyProperties;

            if (keyData.key.type === 'minor') {
                // For minor keys, use melodic structure
                keyProperties = {
                    ...keyData.key.natural,
                    ...keyData.key.melodic,
                    type: keyData.key.type,//the type key is not in natural structure so you have to explicitly add it.
                }
            } else {
                // For major keys, use direct key properties
                keyProperties = keyData.key;
            }

            const {
                chords,
                scale,
                type,
                triads
            } = keyProperties;

            console.log('NEWNEWNEWNW', chords)

            console.log('TYPETYPETYPE', type)

            return (
                <div key={`${keyData.name}-${index}`} className="course-card">
                    <CustomCourseTile
                        chords={chords}
                        scale={scale}
                        type={type}
                        triads={triads}
                    />
                </div>
            );
        })}

        </div>

    </div>
  )
}

export default CustomCourseListItems
