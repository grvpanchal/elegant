import { html } from "lit";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import style from './Input.style';

export default function Input(props) {
  useComputedStyles(this, [style]);
  let id = props.id;
  if (!id) {
    id = Math.random();
  }
  return html`
      <label htmlFor=${id} class="sr-only">
        ${props.name || "Some Label"}
      </label>
      <input 
        type=${props.type}
        id=${props.id}
        name=${props.name}
        placeholder=${props.placeholder}
      />
   `;
}
