export interface FilterItem {
  id: string;
  label: string;
  selected: boolean;
}

const initialFiltersState: FilterItem[] = [
  { id: 'SHOW_ALL', label: 'All', selected: true },
  { id: 'SHOW_ACTIVE', label: 'Active', selected: false },
  { id: 'SHOW_COMPLETED', label: 'Completed', selected: false },
];

export default initialFiltersState;
