import { css, html } from "lit";
import emit from "../../../utils/events/emit";
import "../../atoms/Link/app-link";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import style from './FilterGroup.style';

function FilterGroup({ filterItems }) {
  useComputedStyles(this, [style]);
  return html`
  <div class="grouped" role="group">
    ${filterItems.map((filterItem) => html`
      <app-link key=${filterItem.id} .isActive=${filterItem.selected} @onClick=${() => emit(this, "onFilterClick", filterItem.id)}>${filterItem.label}</app-link>
    `)}
  </div>
`;
}

export default FilterGroup;
