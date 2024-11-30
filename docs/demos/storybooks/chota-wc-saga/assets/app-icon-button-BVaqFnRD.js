import{c as o,u as p}from"./useComputedStyles-DPZnygVX.js";import{i as a,x as r}from"./lit-element-CBvJUqC2.js";import"./app-button-dWzH9IzQ.js";import{I as c}from"./Image.component-DvbBOR1m.js";import{e as u}from"./emit-DOoe1CjV.js";const l=a``;customElements.define("app-image",o(c));function f({iconName:e,alt:m,variant:n,size:s,color:t,onClick:i}){return p(this,[l]),r`
    <app-button
      .classes=${`button icon-only ${n}`}
      @onClick=${()=>u(this,"onClick",i)}
    >
      <app-image
        .alt=${m}
        .src=${`https://icongr.am/feather/${e}.svg?size=${s}&color=${t||""}`}
      ></app-image>
    </app-button>
  `}customElements.define("app-icon-button",o(f));
