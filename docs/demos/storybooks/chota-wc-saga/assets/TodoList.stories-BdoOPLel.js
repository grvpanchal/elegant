import{x as o}from"./lit-element-CBvJUqC2.js";import"./app-alert-hfrJzRwg.js";import"./app-add-todo-form-B72MMEJb.js";import"./app-todo-items-BlnH7a6j.js";import"./app-skeleton-B-aTKx_j.js";import"./useComputedStyles-DPZnygVX.js";import"./app-icon-button-BVaqFnRD.js";import"./app-button-dWzH9IzQ.js";import"./app-loader-CzuIFrWV.js";import"./emit-DOoe1CjV.js";import"./Image.component-DvbBOR1m.js";import"./app-input-k_-HBCXS.js";import"./app-todo-item-BUVWzO9_.js";function v({todoData:e,events:$}){const{onTodoCreate:L,onTodoEdit:k,onTodoUpdate:C,onTodoToggleUpdate:b,onTodoDelete:h}=$;return o`
      ${e.error?o`
        <app-alert
          .variant=${"error"}
          .show=${!!e.error}
          .message=${e.error}
        ></app-alert>
      `:null}
      <app-add-todo-form
        .todoValue=${e.currentTodoItem.text||""}
        @onTodoAdd=${L}
        @onTodoUpdate=${C}
        .placeholder=${"Add your task"}
        .isLoading=${e.isActionLoading}
        .buttonInfo=${{label:e.currentTodoItem.text?"Save":"Add",variant:"primary"}} 
      ></app-add-todo-form>
      ${e.isContentLoading?o`
          <br />
          <app-skeleton height="24px" ></app-skeleton>
          <br />
          <app-skeleton height="24px" ></app-skeleton>
          <br />
          <app-skeleton height="24px" ></app-skeleton>
      `:o`
          <app-todo-items
            .todos=${e.todoItems||[]}
            .isDisabled=${e.isActionLoading}
            @onToggleClick=${b}
            @onDeleteClick=${h}
            @onEditClick=${k}
          ></app-todo-items>
      `}
  `}const B={title:"Organisms/TodoList",render:v},s={onTodoCreate:()=>{},onTodoEdit:()=>{},onTodoUpdate:()=>{},onTodoToggleUpdate:()=>{},onTodoDelete:()=>{}},t={args:{todoData:{todoItems:[{id:0,text:"apple",completed:!1},{id:1,text:"mango",completed:!1},{id:2,text:"oranges",completed:!1}],currentTodoItem:{id:"",text:"",completed:!1}},events:s}},n={args:{todoData:{todoItems:[],currentTodoItem:{id:"",text:"",completed:!1}},events:s}},r={args:{todoData:{isContentLoading:!0,todoItems:[],currentTodoItem:{id:"",text:"",completed:!1}},events:s}},a={args:{todoData:{error:"Unable to load contents",isContentLoading:!1,todoItems:[],currentTodoItem:{id:"",text:"",completed:!1}},events:s}};var d,p,i;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    todoData: {
      todoItems: [{
        id: 0,
        text: 'apple',
        completed: false
      }, {
        id: 1,
        text: 'mango',
        completed: false
      }, {
        id: 2,
        text: 'oranges',
        completed: false
      }],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events
  }
}`,...(i=(p=t.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};var m,l,c;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    todoData: {
      todoItems: [],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events
  }
}`,...(c=(l=n.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var g,u,T;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    todoData: {
      isContentLoading: true,
      todoItems: [],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events
  }
}`,...(T=(u=r.parameters)==null?void 0:u.docs)==null?void 0:T.source}}};var f,x,I;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    todoData: {
      error: 'Unable to load contents',
      isContentLoading: false,
      todoItems: [],
      currentTodoItem: {
        id: '',
        text: '',
        completed: false
      }
    },
    events
  }
}`,...(I=(x=a.parameters)==null?void 0:x.docs)==null?void 0:I.source}}};const F=["Default","Empty","Loading","Error"];export{t as Default,n as Empty,a as Error,r as Loading,F as __namedExportsOrder,B as default};
