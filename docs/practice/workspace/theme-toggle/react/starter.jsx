import { useEffect, useState } from "react";
import "./ThemeToggle.style.css";

const MODES = ["system", "light", "dark"];

/**
 * ThemeToggle.
 * - cycles system -> light -> dark
 * - "system" follows prefers-color-scheme AND keeps following OS changes
 * - an explicit choice is stored and stops tracking the system
 * - writes documentElement.dataset.theme; the no-flash inline script in <head>
 *   is what decides the FIRST paint, not this component
 * - every localStorage read and write is wrapped in try/catch
 * - the control announces its current state
 */
export default function ThemeToggle() {
  const [mode, setMode] = useState("system");
  // Your code here.
  return <button type="button" onClick={() => setMode(MODES[(MODES.indexOf(mode) + 1) % 3])}>{mode}</button>;
}
