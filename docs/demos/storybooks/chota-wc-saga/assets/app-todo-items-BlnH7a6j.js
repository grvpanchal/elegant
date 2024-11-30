import{u as o,c as s}from"./useComputedStyles-DPZnygVX.js";import{i as p,x as i}from"./lit-element-CBvJUqC2.js";import{e as l}from"./emit-DOoe1CjV.js";import"./app-todo-item-BUVWzO9_.js";const n=p`
.todo-items {
  list-style: none;
  padding: 0;
}
.empty-text {
  padding-top: 1.5rem;
}
`;function c({todos:t,isDisabled:m}){return o(this,[n]),t&&t.length?i`
    <ul class="todo-items">
      ${t.map(e=>i`
        <app-todo-item
          .key=${e.id}
          .id=${e.id}
          .text=${e.text}
          .completed =${e.completed}
          .isDisabled=${m}
          @onToggleClick=${()=>l(this,"onToggleClick",e)}
          @onEditClick=${()=>l(this,"onEditClick",e)}
          @onDeleteClick=${()=>l(this,"onDeleteClick",e.id)}
        ></app-todo-item>
      `)}
    </ul>
  `:i`
    <p class="text-center empty-text">Nothing to display here. Carry on.</p>
  `}customElements.define("app-todo-items",s(c));
