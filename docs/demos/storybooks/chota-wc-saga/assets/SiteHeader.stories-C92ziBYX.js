import{i as h,x as n}from"./lit-element-CBvJUqC2.js";import{u as p,c as m}from"./useComputedStyles-DPZnygVX.js";const l=h`
.header {
  padding: 5rem 0 1rem 0;
}
.header-block {
  display: flex;
  justify-content: space-between;
}
.pointer {
  cursor: pointer;  
}
`;function u({headerData:e,events:o}){p(this,[l]);const{brandName:d,theme:i}=e,{onThemeChangeClick:c}=o;return n`
    <header class="header">
      <div class="header-block">
        <div>
          <h1>${d}</h1>
        </div>
        <div>
          <h1 role="button" @click=${()=>c()} class="text-right pointer">${i==="dark"?"☀️":"🌙"}</h1>
        </div>
      </div>
    </header>
  `}customElements.define("app-site-header",m(u));const b={title:"Organisms/SiteHeader",render:e=>n`<app-site-header .headerData=${e.headerData} .events=${e.events} ></app-todo-items>`},v={onThemeChangeClick:()=>{}},t={args:{headerData:{brandName:"Todo App",theme:"light"},events:v}};var a,r,s;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    headerData: {
      brandName: 'Todo App',
      theme: 'light'
    },
    events
  }
}`,...(s=(r=t.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const k=["Default"];export{t as Default,k as __namedExportsOrder,b as default};
