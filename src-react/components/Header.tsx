import { Link } from "react-router";
import tavaLogo from "../assets/tava-logo.svg";

const Header = () => {
  return (
    <header>
      <a className="header-home-link" href="https://tavahealth.com" target="_blank">
        <img src={tavaLogo} className="logo" alt="Tava Health Logo" />
      </a>
      <Link to="/people/">All People</Link>
      <Link to="/employees/">Employees</Link>
      <Link to="/users/">Users</Link>
      <Link to="/people/new/">New Person</Link>
    </header>
  );
};

export default Header;
