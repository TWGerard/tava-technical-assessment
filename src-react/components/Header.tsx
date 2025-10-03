import { Link, useLocation } from "react-router";
import tavaLogo from "../assets/tava-logo.svg";

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header>
      <a className="header-home-link" href="https://tavahealth.com" target="_blank">
        <img src={tavaLogo} className="logo" alt="Tava Health Logo" />
      </a>
      <Link to={{ pathname: "/people/", search: '' }} className={pathname == "/people/" ? "current-page" : ""}>All People</Link>
      <Link to={{ pathname: "/employees/", search: '' }} className={pathname == "/employees/" ? "current-page" : ""}>Employees</Link>
      <Link to={{ pathname: "/users/", search: '' }} className={pathname == "/users/" ? "current-page" : ""}>Users</Link>
      <Link to="/people/new/" className={pathname == "/people/new/" ? "current-page" : ""}>New Person</Link>
    </header>
  );
};

export default Header;
