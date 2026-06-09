import { Link } from "react-router-dom";

const NavItem = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={`nav-item ${active ? "nav-item-active" : "nav-item-inactive"}`}
  >
    <span
      className={`material-symbols-outlined ${active ? "filled-icon" : ""}`}
    >
      {icon}
    </span>
    {label}
  </Link>
);

export default NavItem;
