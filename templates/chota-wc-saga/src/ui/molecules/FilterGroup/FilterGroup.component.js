
import Link from "../../atoms/Link/Link.component";

const FilterGroup = ({ filterItems, onFilterClick }) => (
  <div className="grouped" role="group">
    {filterItems.map((filterItem) => (
      <Link key={filterItem.id} active={filterItem.selected} onClick={() => onFilterClick(filterItem.id)}>{filterItem.label}</Link>
    ))}
  </div>
);

export default FilterGroup;
