import { useAtomicContext } from "../../../utils/providers/AtomicProvider";
import Button from "../Button/Button.component";
import Image from "../Image/Image.component";

export default function IconButton({
  iconName,
  alt,
  variant,
  size,
  color,
  onClick,
  ...props
}) {
  const { theme } = useAtomicContext();
  const themeColor = theme === "dark" ? "ffffff" : "";
  return (
    <Button
      className={`button icon-only ${variant}`}
      data-value={props["data-value"]}
      data-testid={props["data-testid"]}
      onClick={onClick}
    >
      <Image
        alt={alt}
        src={`https://icongr.am/feather/${iconName}.svg?size=${size}&color=${
          color ? color : themeColor
        }`}
      />
    </Button>
  );
}
