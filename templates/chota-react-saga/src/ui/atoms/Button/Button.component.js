import Loader from "../Loader/Loader.component";

import './Button.style.css';

export default function Button(props) {
  const transformedProps = { ...props };
  delete transformedProps.isLoading;
  if (props.isLoading) {
    return (
      <button {...transformedProps} disabled={props.isLoading} className={`${props.className} loading-button`}>
        <Loader width="2px" size="1.2rem" color="#fff" />
      </button>
    );
  }
  return <button {...transformedProps}>{props.children}</button>;
}
