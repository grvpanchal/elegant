import { useConstructableStylesheets } from "./useConstructableStylesheets";

export default function useComputedStyles(scope, styles, isGlobalAdoptedStyleSheetEnabled = true) {
  useConstructableStylesheets(scope, styles, isGlobalAdoptedStyleSheetEnabled);
}