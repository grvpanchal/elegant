import{u as l,c as a}from"./useComputedStyles-DPZnygVX.js";import{i as c,x as p}from"./lit-element-CBvJUqC2.js";import{e as o}from"./emit-DOoe1CjV.js";import"./app-input-k_-HBCXS.js";import"./app-icon-button-BVaqFnRD.js";const s=c`
.todo-item {
  vertical-align: middle;
  clear: both;
  list-style-type: none;
}

.todo-item input {
  margin-right: 1.5rem;
  vertical-align: middle;
  height: 36px;
}

.todo-item .icon-buttons {
  float: right;
}
`;function m({onToggleClick:r,completed:e,text:n,id:i,onEditClick:$,onDeleteClick:h}){return l(this,[s]),p`
  <li
    style=${`text-decoration: ${e?"line-through":"none"};`}
    class="todo-item"
  >
    <label htmlFor=${`checkbox${i}`}>
      <app-input
        id=${`checkbox${i}`}
        @onInput=${t=>o(this,"onToggleClick",t)}
        name="checkbox"
        .type=${"checkbox"}
        @onChange=${t=>t.target.value}
        .checked=${e}
      ></app-input>
        ${n}
      <span class="icon-buttons">
        <app-icon-button
          .variant=${"clear"}
          .alt=${"edit"}
          .iconName=${"edit"}
          .size=${"16"}
          @onClick=${t=>o(this,"onEditClick",t)}
        ></app-icon-button>
        <app-icon-button
          .variant=${"clear"}
          .alt=${"edit"}
          .iconName=${"trash-2"}
          .size=${"16"}
          @onClick=${t=>o(this,"onDeleteClick",t)}
        ></app-icon-button>
      </span>
    </label>
  </li>
  `}customElements.define("app-todo-item",a(m));
