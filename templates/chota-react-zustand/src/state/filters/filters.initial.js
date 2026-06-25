import { SHOW_ACTIVE, SHOW_ALL, SHOW_COMPLETED } from "./filters.type";

const initialFiltersState = [
  {
    id: SHOW_ALL,
    label: "All",
    selected: true,
  },
  {
    id: SHOW_COMPLETED,
    label: "Completed",
    selected: false,
  },
  {
    id: SHOW_ACTIVE,
    label: "Active",
    selected: false,
  },
];

export default initialFiltersState;
