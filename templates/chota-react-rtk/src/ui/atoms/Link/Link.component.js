/* eslint-disable jsx-a11y/anchor-is-valid */
import { propTypes } from "./Link.type";



const Link = ({ active, children, onClick }) => (
  <a
    href="#"
    className={`button ${active ? "primary" : "outline"}`}
    onClick={onClick}
    disabled={active}
    role="button"
  >
    {children}
  </a>
);

Link.propTypes = propTypes

export default Link;
