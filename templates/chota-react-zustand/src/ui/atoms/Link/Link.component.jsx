/* eslint-disable jsx-a11y/anchor-is-valid */
import { propTypes } from "./Link.type";



const Link = ({ isActive, children, onClick }) => (
  <a
    href="#"
    className={`button ${isActive ? "primary" : "outline"}`}
    onClick={onClick}
    disabled={isActive}
    role="button"
  >
    {children}
  </a>
);

Link.propTypes = propTypes

export default Link;
