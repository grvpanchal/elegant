import "./Skeleton.style.css";

export default function Skeleton({ variant, height, width, style }) {
  return (
    <div
      className={`skeleton skeleton-${variant ? variant : "text"}`}
      style={{
        ...style,
        height,
        width,
      }}
    ></div>
  );
}
