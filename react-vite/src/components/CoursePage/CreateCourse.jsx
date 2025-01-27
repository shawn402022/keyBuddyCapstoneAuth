import {useState } from "react"
import { createCoursesFetch } from "../../redux/course"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import "./CoursePage.css"


const CreateCourse = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [form, setForm ] = useState({
        course_name:null,
        details_of_course:null
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        dispatch(createCoursesFetch(form.course_name, form.details_of_course))
        navigate('/course')
    }

    return (
        <div  >
        <h1 className='create-course-title' >Create Course</h1>
            <form className='create-course'  onSubmit={handleSubmit}>
                <label>
                    CourseName
                    <select
                        value={form.course_name}
                        onChange={(e) => setForm({...form, course_name: e.target.value})}
                        required
                    >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="min">min</option>
                        <option value="maj">maj</option>
                        <option value="dim">dim</option>
                        <option value="aug">aug</option>
                        <option value="sus">sus</option>
                    </select>
                </label>
                <label>
                    Details of Course
                    <input
                    type="text"
                    value={form.details_of_course}
                    onChange={(e) => setForm({...form, details_of_course: e.target.value})}required
                    />
                </label>
                <button type="submit">
                create
                </button>
            </form>
            <img className="scales"
            src="/images/background-scales-lighter.png"
            alt="KBuddy logo" />

        </div>
    )
}

export default CreateCourse
