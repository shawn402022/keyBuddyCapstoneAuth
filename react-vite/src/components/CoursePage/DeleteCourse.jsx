import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { deleteCourseThunk } from '../../redux/course'

const DeleteCourse = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { courseId } = useParams()
    const [error, setError] = useState(null)

    const handleDelete = async () => {
        try {
            await dispatch(deleteCourseThunk(courseId))
            navigate('/course')
        } catch (error) {
            setError("Failed to delete course")
        }
    }

    return (
        <div>
            <h2>Delete Course</h2>
            {error && <p className="error">{error}</p>}
            <p>Are you sure you want to delete this course?</p>
            <button onClick={handleDelete}>Yes, Delete Course</button>
            <button onClick={() => navigate('/course')}>Cancel</button>
        </div>
    )
}

export default DeleteCourse
