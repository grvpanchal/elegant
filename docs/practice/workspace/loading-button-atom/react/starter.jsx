import Loader from "../Loader/Loader.component";
import "./Button.style.css";

/**
 * Button atom.
 * - children render as the label
 * - isLoading swaps the label for <Loader />, disables the button and sets aria-busy
 * - every other prop passes through to <button>
 */
export default function Button({ isLoading = false, children, ...rest }) {
  // Your code here.
  return <button {...rest}>{children}</button>;
}
