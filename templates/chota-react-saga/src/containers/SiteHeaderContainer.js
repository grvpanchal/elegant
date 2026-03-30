import { useDispatch, useSelector } from "react-redux";
import SiteHeader from "../ui/organisms/SiteHeader/SiteHeader.component";
import { updateConfig } from "../state/config/config.actions";
export default function SiteHeaderContainer() {
  const configData = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const events = {
    onThemeChangeClick: () => dispatch(
      updateConfig({ theme: configData.theme === "light" ? "dark" : "light" })
    ),
  };

  const headerData = { brandName: configData.name, theme: configData.theme };
  return (
    <SiteHeader
      headerData={headerData}
      events={events}
    />
  );
}
