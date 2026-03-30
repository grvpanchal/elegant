import{u as c,a as f,b as $,c as b}from"./useComputedStyles-DPZnygVX.js";import{i as h,x as v}from"./lit-element-CBvJUqC2.js";import"./app-input-k_-HBCXS.js";import"./app-button-dWzH9IzQ.js";import{e as a}from"./emit-DOoe1CjV.js";const g=h``;function C({buttonInfo:p,placeholder:r,isLoading:s,todoValue:e}){c(this,[g]);const[o,n]=f(e||""),{label:u,variant:m}=p,d=t=>{const{value:l}=t.target;n(l)};$(()=>n(e),[e]);const i=t=>{t&&t.preventDefault&&t.preventDefault(),o.trim()&&(e?a(this,"onTodoUpdate",o):a(this,"onTodoAdd",o),n(""))};return v`
    <div>
      <form
        @submit=${i}
      >
        <div class="grouped">
          <app-input .value=${o} .disabled=${s} .placeholder=${r} @onChange=${t=>d(t.detail)} ></app-input>
          <app-button .classes=${`button ${m}`} .isLoading=${s} type="submit" @onClick=${()=>i(this)}>
            ${u}
          </app-button>
        </div>
      </form>
    </div>
  `}customElements.define("app-add-todo-form",b(C));
