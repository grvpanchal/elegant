import useStore from "../state";
import SiteHeader from "../ui/organisms/SiteHeader/SiteHeader.component";
export default function SiteHeaderContainer() {
  const configData = useStore((state) => state.config);
  const updateConfig = useStore((state) => state.updateConfig);
  const events = {
    onThemeChangeClick: () =>
      updateConfig({ theme: configData.theme === "light" ? "dark" : "light" }),
  };

  const headerData = { brandName: configData.name, theme: configData.theme };
  return (
    <SiteHeader
      headerData={headerData}
      events={events}
    />
  );
}
