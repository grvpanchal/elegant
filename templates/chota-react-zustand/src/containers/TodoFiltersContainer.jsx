import useStore from "../state";
import TodoFilters from "../ui/organisms/TodoFilters/TodoFilters.component";

export default function TodoFiltersContainer() {
  const filtersData = useStore((state) => state.filters);
  const setVisibilityFilter = useStore((state) => state.setVisibilityFilter);

  const events = {
    onTodoFilterUpdate: (id) => setVisibilityFilter(id),
  };

  return <TodoFilters filtersData={filtersData} events={events} />;
}
