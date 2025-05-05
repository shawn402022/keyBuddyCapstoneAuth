import {useState, useEffect} from "react"
import { createCoursesFetch } from "../../redux/course"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import PianoChordDetail from "../Piano/PianoChordDetail"
import "./CoursePage.css"


const CreateCourse = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.session.user);

    const [form, setForm ] = useState({
        course_name:"",
        details_of_course:null
    })

    useEffect(() => {
        if (!user || user.full_name !== "Admin User") {
            navigate('/course');
        }
    }, [user, navigate]);

    //create course on submit
    const handleSubmit = async(e) => {
        e.preventDefault()
        await dispatch(createCoursesFetch(form.course_name, form.details_of_course))
        navigate('/course')
    }
    if (!user || user.full_name !== "Admin User") {
        return null; // or you could return a "Not Authorized" message
    }

    return (
        <div  >
        <PianoChordDetail/>



        </div>
    )
}

export default CreateCourse
