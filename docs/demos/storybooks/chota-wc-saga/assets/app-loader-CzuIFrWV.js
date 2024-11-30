import{u as e,c as a}from"./useComputedStyles-DPZnygVX.js";import{i as n,x as i}from"./lit-element-CBvJUqC2.js";const s=n`
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #000;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;function d({size:o,width:r,color:t}){return e(this,[s]),i`
    <span
      class="loader"
      style=${`
        height: ${o||"48px"};
        width: ${o||"48px"};
        border: ${`${r||"5px"} solid ${t||"#fff"}`};
        border-bottom-color: transparent;
      `}
    ></span>
  `}customElements.define("app-loader",a(d));
