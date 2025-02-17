
export const addToUserCourses = (courseData) => async (dispatch) => {
    const response = await fetch('/api/user-courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addUserCourse(data));
    }
};
