

import "./Layout.style.css";

export default function Layout({ children }) {
  return (
    <div className="container layout">
      {children}
    </div>
  );
}
