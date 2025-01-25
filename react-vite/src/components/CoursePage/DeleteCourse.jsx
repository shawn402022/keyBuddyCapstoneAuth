import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

const DeleteCourse = () => {
    const navigate = useNavigate()
    const { courseId } = useParams()
    const [error, setError] = useState(null)

    const handleDelete = async () => {
        const response = await fetch(`/api/course/admin/delete/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            navigate('/course')
        } else {
            const data = await response.json()
            setError(data.msg)
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
