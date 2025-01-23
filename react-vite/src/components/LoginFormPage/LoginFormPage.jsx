import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;


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
      navigate("/");
    }
  };

  return (
    <div className='login-page-div'>
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form className='login-page'  onSubmit={handleSubmit}>
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
        <button type="submit">
        {<img className="login-word"
          src="../dist/images/login-word.png"
          alt="Home" />}
        </button>
      </form>
    </div>
  );
}

export default LoginFormPage;
