import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage';
import CoursePage from '../components/CoursePage/CoursePage';
import CreateCourse from '../components/CoursePage/CreateCourse';
import SongInfoPage from '../components/CourseInfoPage/SongInfoPage';
import CreateSongPage from '../components/CourseInfoPage/CreateSongPage';
import ReviewsPage from '../components/ReviewsPage/ReviewsPage';
import CreateReviewPage from '../components/ReviewsPage/CreateReviewPage';
import DeleteCourse from '../components/CoursePage/DeleteCourse';
import MyCoursePage from '../components/CoursePage/MyCoursePage';







export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "course",
        element: <CoursePage/>,
      },
      {
        path: "course/:userId",
        element: <MyCoursePage/>,
      },
      {
        path: "createCourse",
        element: <CreateCourse/>
      },
      {
        path: "course/admin/delete/:courseId",
        element: <DeleteCourse />
      },
      {
        path: '/create-song',
        element: <CreateSongPage />
      },
      {
        path: ":songs/:song_key",
        element: <SongInfoPage />,
      },
      {
        path:"/review",
        element: <ReviewsPage />
      },
      {
        path:"/review/create",
        element: <CreateReviewPage />
      },

      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],

  },
]);
