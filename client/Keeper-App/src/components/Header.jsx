import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import HighlightIcon from "@mui/icons-material/Highlight";

export const Header = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  return (
    <header>
      <h1>
        <HighlightIcon />
        Honey Keeper
      </h1>
      {!cookies.access_token ? (
        <Link to="/auth">Login/Register</Link>
      ) : (
        <>
          <button className="button-22 logout" onClick={logout}>
            Logout
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
