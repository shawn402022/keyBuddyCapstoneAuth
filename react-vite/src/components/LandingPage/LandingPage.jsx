
import "./LandingPage.css"
import { useSelector } from "react-redux";
import MainPage from "../MainPage/MainPage";

const LandingPage = () => {
    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser) {
        return (
            <div className="authenticated-landing">
                {/* Your logged-in user content here */}
                    <MainPage />
                {/* Add your authenticated user interface */}
            </div>
        );
    }

    return (
        <div className="landing-logo">
            <img className="keyboard-logo"
            src="/images/landing_keyboard.png"
            alt="KBuddy logo" />

            <img className="title"
            src="/images/key-buddy-title-font.png"
            alt="KBuddy logo" />

            <img className="scales"
            src="/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>
    )
}

export default LandingPage
