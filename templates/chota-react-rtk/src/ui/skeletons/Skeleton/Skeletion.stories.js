import Skeleton from "./Skeleton.component";
export default { title: "Skeletons/Skeleton", component: Skeleton };

export const Default = {
  args: {
    variant: "text",
  },
};

export const Image = {
  args: {
    variant: "text",
    height: "400px",
    width: "600px",
  },
};

export const Avatar = {
    args: {
      variant: "circle",
      height: "64px",
      width: "64px",
    },
  };
