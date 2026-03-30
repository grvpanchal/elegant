import{u as e,c as s}from"./useComputedStyles-DPZnygVX.js";import{i,x as n}from"./lit-element-CBvJUqC2.js";import{e as l}from"./emit-DOoe1CjV.js";const m=i``;function r({isActive:t,onClick:o}){return e(this,[m]),n`
    <a
      href="#"
      class=${`button ${t?"primary":"outline"}`}
      @click=${()=>l(this,"onClick",o)}
      .disabled=${t}
      role="button"
    >
      <slot></slot>
    </a>
  `}customElements.define("app-link",s(r));
