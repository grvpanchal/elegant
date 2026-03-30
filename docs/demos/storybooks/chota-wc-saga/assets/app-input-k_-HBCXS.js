import{u as i,c as l}from"./useComputedStyles-DPZnygVX.js";import{i as m,x as o}from"./lit-element-CBvJUqC2.js";import{e as a}from"./emit-DOoe1CjV.js";const d=m`
:host {
    padding: 0 !important;
    width: 100%;
}
`;function c(e){i(this,[d]);let t=e.id;return t||(t=Math.random()),o`
      <label htmlFor=${t} class="sr-only">
        ${e.name||"Some Label"}
      </label>
      <input 
        type=${e.type}
        .value=${e.value}
        .checked=${e.checked}
        id=${e.id}
        name=${e.name}
        placeholder=${e.placeholder}
        @change=${n=>a(this,"onChange",n)}
        @input=${n=>a(this,"onInput",n)}
      />
   `}customElements.define("app-input",l(c));
