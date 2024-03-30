import "./Loader.style.css";

export default function Loader({ size, width, color }) {
  return (
    <span
      class="loader"
      style={{
        height: size || "48px",
        width: size || "48px",
        border: `${width || "5px"} solid ${color || "#fff"}`,
        borderBottomColor: "transparent",
      }}
    ></span>
  );
}
