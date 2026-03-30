import { setVisibilityFilter } from "../state/filters/filters.action";
import TodoFilters from "../ui/organisms/TodoFilters/TodoFilters.component";
import { useDispatch, useSelector } from "react-redux";

export default function TodoFiltersContainer() {
  const filtersData = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  const events = {
    onTodoFilterUpdate: (id) => dispatch(setVisibilityFilter(id)),
  };

  return <TodoFilters filtersData={filtersData} events={events} />;
}
