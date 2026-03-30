import{u as l,a as n,b as m,c}from"./useComputedStyles-DPZnygVX.js";import{i as f,x as p}from"./lit-element-CBvJUqC2.js";import"./app-icon-button-BVaqFnRD.js";import{e as g}from"./emit-DOoe1CjV.js";const d=f`
.alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
}

.alert .message * { 
  vertical-align: middle;
  line-height: 0;
}

.alert .message img {
  margin-right: 1rem;
}
`;function u({variant:t,show:e,message:i}){l(this,[d]);const[r,a]=n(e),s=o=>{a(!1),g(this,"onCloseClick",o)};return m(()=>{a(e)},[e]),r?p`
    <div
      class=${`bg-${t==="error"?"error":"primary"} text-white alert`}
    >
      <div class="message">
        <app-image
          .src=${`https://icongr.am/feather/${t==="error"?"alert-triangle":"info"}.svg?size=24&color=ffffff`}
          .alt={variant}
        ></app-image>
        <span>${i}</span>
      </div>
      <div>
        <app-icon-button
          .variant=${"clear"}
          alt="close"
          .color=${"ffffff"}
          .iconName=${"x"}
          .size=${"16"}
          @onClick=${s}
        ></app-icon-button>
      </div>
    </div>
  `:null}customElements.define("app-alert",c(u));
