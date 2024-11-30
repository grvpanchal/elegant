import{u as n,c as l}from"./useComputedStyles-DPZnygVX.js";import{i,x as r}from"./lit-element-CBvJUqC2.js";const a=i`
.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
  display: block;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}

.skeleton-text {
  width: 100%;
  height: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
}

.skeleton-circle {
  border-radius: 50%;
}
`;function d({variant:e,height:t,width:o,styleCSS:s}){return n(this,[a]),r`
    <div
      class=${`skeleton skeleton-${e||"text"}`}
      style=${`
        ${s||""}
        height: ${t};
        width: ${o};
      `}
    ></div>
  `}customElements.define("app-skeleton",l(d));
