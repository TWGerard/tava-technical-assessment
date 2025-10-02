import { Link, useLocation } from "react-router";
import tavaLogo from "../assets/tava-logo.svg";

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header>
      <a className="header-home-link" href="https://tavahealth.com" target="_blank">
        <img src={tavaLogo} className="logo" alt="Tava Health Logo" />
      </a>
      <Link to="/people/" className={pathname == "/people/" ? "current-page" : ""}>All People</Link>
      <Link to="/employees/" className={pathname == "/employees/" ? "current-page" : ""}>Employees</Link>
      <Link to="/users/" className={pathname == "/users/" ? "current-page" : ""}>Users</Link>
      <Link to="/people/new/" className={pathname == "/people/new/" ? "current-page" : ""}>New Person</Link>
    </header>
  );
};

export default Header;
