import { useEffect } from "react";
import useStore from "../state";
export default function ConfigContainer() {
  const theme = useStore((state) => state.config.theme);
  useEffect(() => {
    const bodyClass = document.body.classList;
    theme === 'dark'
      ? bodyClass.add("dark")
      : bodyClass.remove("dark");
  }, [theme]);
  return null;
}
