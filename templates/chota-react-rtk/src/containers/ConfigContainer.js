import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function ConfigContainer() {
  const configData = useSelector((state) => state.config);
  useEffect(() => {
    const bodyClass = document.body.classList;
    configData.theme === 'dark'
      ? bodyClass.add("dark")
      : bodyClass.remove("dark");
  }, [configData.theme]);
  return null;
}
