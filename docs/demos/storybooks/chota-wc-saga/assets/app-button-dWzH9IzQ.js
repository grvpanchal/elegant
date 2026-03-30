import{u as n,c as i}from"./useComputedStyles-DPZnygVX.js";import{i as s,x as o}from"./lit-element-CBvJUqC2.js";import"./app-loader-CzuIFrWV.js";import{e}from"./emit-DOoe1CjV.js";const a=s`
:host {
  padding: 0 !important;
}
.loading-button {
  min-width: 80px;
}
`;function u(t){return n(this,[a]),t.isLoading?o`
      <button type="button" class=${`${t.classes} loading-button`}>
        <app-loader .width=${"2px"} .size=${"1.2rem"} .color=${"#fff"}>Loading...</app-loader>
      </button>
    `:o`<button type="button"
      class="${t.classes}"
      @click="${()=>e(this,"onClick",t)}"><slot></slot></button>`}customElements.define("app-button",i(u));
