import FilterGroup from "../../molecules/FilterGroup/FilterGroup.component";
import Skeleton from "../../skeletons/Skeleton/Skeleton.component";

export default function TodoFilters({ filtersData, events }) {
  const {
    onTodoFilterUpdate,
  } = events;
  return (
    <>
      {filtersData.isContentLoading ? (
        <div style={{display:'flex', gap: '1rem'}}>
          <Skeleton height="24px" />
          <Skeleton height="24px" />
          <Skeleton height="24px" />
        </div>
      ) : (
        <>
          <FilterGroup
            filterItems={filtersData}
            onFilterClick={onTodoFilterUpdate}
          />
        </>
      )}
    </>
  );
}
