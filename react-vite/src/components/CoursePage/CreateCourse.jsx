import {useState } from "react"
import { createCoursesFetch } from "../../redux/course"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

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
        navigate('/courses')
    }

    return (
        <div>
        <h1>Create Course</h1>
            <form  onSubmit={handleSubmit}>
                <label>
                    CourseName
                    <input
                    type='text'
                    value={form.course_name}
                    onChange={(e) => setForm({...form,course_name: e.target.value})}
                    required
                    />
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
