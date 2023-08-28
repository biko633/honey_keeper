import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useGetUserID } from "../hooks/useGetUserID.jsx";

//////PUT TEXT SO I KNOW WHAT IS WHAT/////////
////// SOMETHING IS CONSOLE LOGGING IN SERVER SEE WHAT IS IT /////////

export const UserForm = () => {
  const navigator = useNavigate();
  const userID = useGetUserID();
  useEffect(() => {
    if (userID) {
      navigator("/");
    }
  }, []);

  return (
    <div className="main">
      <LoginForm />
    </div>
  );
};

const LoginForm = () => {
  const [RegBut, setRegBut] = useState(false);
  const [LogBut, setLogBut] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Error_Massage, setError_Massage] = useState("");
  const [Error_Box, setError_Box] = useState("hidden");
  const navigator = useNavigate();
  const [_, setCookies] = useCookies(["access_token"]);
  const R_URL = import.meta.env.VITE_register_URL;
  const L_URL = import.meta.env.VITE_login_URL;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (RegBut) {
      try {
        const response = await axios.post(R_URL, {
          username: username,
          password: password,
        });

        if (response.data.message) {
          setError_Massage(response.data.message);
          setError_Box("");
          setRegBut(false);
        } else {
          setError_Massage("");
          setError_Box("");
          setCookies("access_token", response.data.token);
          window.localStorage.setItem("userID", response.data.userID);
          setRegBut(false);
          navigator("/");
        }
      } catch (err) {
        console.error(err);
      }
    } else if (LogBut) {
      try {
        const response = await axios.post(L_URL, {
          username: username,
          password: password,
        });
        if (response.data.message) {
          setError_Massage(response.data.message);
          setError_Box("");
          setLogBut(false);
        } else {
          setError_Massage(response.data.message);
          setError_Box("");
          setCookies("access_token", response.data.token);
          window.localStorage.setItem("userID", response.data.userID);
          setLogBut(false);
          navigator("/");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <fieldset className="FieldForm">
        <form className="UserForm" onSubmit={onSubmit}>
          <h2 className="formH2">Login or Register to Enter</h2>
          <fieldset className="Error-style" hidden={Error_Box}>
            <h3 className="error-massage">{Error_Massage}</h3>
          </fieldset>
          <div>
            <PersonIcon />
            <input
              type="text"
              className="userInputs"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div>
            <LockIcon />
            <input
              type="password"
              className="userInputs"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="on"
            />
          </div>
          <div className="button-container">
            <button
              type="submit"
              value={LogBut}
              className="formButton button-22"
              onClick={(event) => setLogBut(true)}
            >
              Login
            </button>
            <button
              type="submit"
              value={RegBut}
              className="formButton RegisterButton button-22"
              onClick={(event) => setRegBut(true)}
            >
              Register
            </button>
          </div>
        </form>
      </fieldset>
    </div>
  );
};
