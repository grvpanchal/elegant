import { css, html } from "lit";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import "../../molecules/FilterGroup/app-filter-group";
import "../../skeletons/Skeleton/app-skeleton";

export default function TodoFilters({ filtersData, events }) {
  useComputedStyles(this, [css``]);
  const {
    onTodoFilterUpdate,
  } = events;
  return filtersData.isContentLoading ? html`
    <div style=${`display: flex; gap: 1rem;`}>
      <app-skeleton height="24px" ></app-skeleton>
      <app-skeleton height="24px" ></app-skeleton>
      <app-skeleton height="24px" ></app-skeleton>
    </div>
    ` : html`
      <app-filter-group
        .filterItems=${filtersData}
        @onFilterClick=${onTodoFilterUpdate}
      ></app-filter-group>
    `
}
