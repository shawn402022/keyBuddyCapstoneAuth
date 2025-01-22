//import MidiKeyboard from "../MidiKeyboardPage/MidiKeyboard";
import "./LandingPage.css"
import { useSelector } from "react-redux";

const LandingPage = () => {
    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser) {
        return (
            <div className="authenticated-landing">
                {/* Your logged-in user content here */}

                {/* Add your authenticated user interface */}
            </div>
        );
    }

    return (
        <div className="landing-logo">
            <img className="keyboard-logo"
            src="../dist/images/landing_keyboard.png"
            alt="KBuddy logo" />

            <img className="title"
            src="../dist/images/key-buddy-title-font.png"
            alt="KBuddy logo" />

            <img className="scales"
            src="../dist/images/background-scales-lighter.png"
            alt="KBuddy logo" />
        </div>
    )
}

export default LandingPage
