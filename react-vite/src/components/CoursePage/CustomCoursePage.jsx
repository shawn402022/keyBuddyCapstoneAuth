import CustomCourseCard from "./CustomCourseCard";
import CustomCourseList from "./CustomCourseList";
const CustomCoursePage = () => {

    return (
        <div className='custom-course-page'>
            <h1 className="custom-course-title">Customize courses</h1>
            <div className='custom-course-ui'>
                <CustomCourseCard />
                <CustomCourseList />
            </div>
        </div>
    )
}

export default CustomCoursePage
