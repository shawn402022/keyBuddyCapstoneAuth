import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage';
import CoursePage from '../components/CoursePage/CoursePage';
import CreateCourse from '../components/CoursePage/CreateCourse';
import SongInfoPage from '../components/CourseInfoPage/SongInfoPage';
import CreateSongPage from '../components/CourseInfoPage/CreateSongPage';






export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "courses",
        element: <CoursePage/>,
      },
      {
        path: "createCourse",
        element: <CreateCourse/>
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
