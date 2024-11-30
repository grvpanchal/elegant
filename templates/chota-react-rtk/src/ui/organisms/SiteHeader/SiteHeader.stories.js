
import SiteHeader from "./SiteHeader.component";
export default { title: "Organisms/SiteHeader", component: SiteHeader };

const events ={
  onThemeChangeClick: () => {},
}

export const Default = {
  args: {
    headerData: {
      brandName: 'Todo App',
      theme: 'light'
    },
    events,
  },
};




