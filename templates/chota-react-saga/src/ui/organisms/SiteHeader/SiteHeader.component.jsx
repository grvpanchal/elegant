import './SiteHeader.style.css';

export default function SiteHeader({ headerData, events }) {
  const { brandName, theme } = headerData;
  const { onThemeChangeClick } = events;
  return (
    <header className="header">
      <div className="header-block">
        <div>
          <h1>{brandName}</h1>
        </div>
        <div>
          <h1 role="button" onClick={() => onThemeChangeClick()} className="text-right pointer">{theme === "dark" ? "☀️" : "🌙"}</h1>
        </div>
      </div>
    </header>
  );
}
