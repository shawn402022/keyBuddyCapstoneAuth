import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const demoLogin = async () => {
    const demoUser = {
      email: "demo@aa.io",
      password: "password"
    };
    const serverResponse = await dispatch(thunkLogin(demoUser));
    if (!serverResponse) closeModal();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();


    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>


      <form  className='login-modal' onSubmit={handleSubmit}>
        <label>
        {<img className="email-word"
          src="../dist/images/email-word.png"
          alt="Home" />}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
        {<img className="password-word"
          src="../dist/images/password-word.png"
          alt="Home" />}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Log In</button>
        <button type="button" onClick={demoLogin}>Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
