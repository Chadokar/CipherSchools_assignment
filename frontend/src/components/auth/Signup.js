import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@$!%#*?&]{8,}$/;
  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      return {
        msg: "Password must have at least 8 characters, one lowercase letter, one uppercase letter, one number, and one special character",
        validate: false,
      };
    } else {
      return { msg: "", validate: true };
    }
  };

  const submithandler = async (e) => {
    e.preventDefault();
    setError({
      ...error,
      password: validatePassword(password).msg,
      validate: validatePassword(password).validate,
    });
    if (!validatePassword(password).validate) return;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/signup",
        {
          email,
          password,
          firstname,
          lastname,
        },
        config
      );
      localStorage.setItem("userToken", JSON.stringify(data.token));
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      console.log(data.user);
      navigate("/smoothies");
      // window.location.reload(true);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  };

  return (
    <div>
      <form
        className="form"
        onSubmit={submithandler}
        style={{ maxWidth: 386 }}
        action=""
      >
        <h2>Sign Up</h2>
        <label htmlFor="email">First Name</label>
        <input
          type="text"
          name="firstname"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
        <label htmlFor="email">Last Name</label>
        <input
          type="text"
          name="lastname"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && error.email && (
          <div className="email error">{error.email}</div>
        )}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        {error && error.password && (
          <div className="password error">{error.password}</div>
        )}
        <button>Log up</button>
      </form>
    </div>
  );
}

export default Signup;
