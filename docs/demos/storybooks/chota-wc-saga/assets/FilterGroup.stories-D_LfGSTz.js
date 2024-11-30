import{i as o,x as r}from"./lit-element-CBvJUqC2.js";import{e as i}from"./emit-DOoe1CjV.js";import"./app-link-D6s_sIjO.js";import{u as d}from"./useComputedStyles-DPZnygVX.js";const c=o`
app-link + app-link { margin-left: 1rem; }
`;function p({filterItems:s}){return d(this,[c]),r`
  <div class="grouped" role="group">
    ${s.map(e=>r`
      <app-link key=${e.id} .isActive=${e.selected} @onClick=${()=>i(this,"onFilterClick",e.id)}>${e.label}</app-link>
    `)}
  </div>
`}const k={title:"Molecules/FilterGroup",render:p},l={args:{filterItems:[{id:"1",label:"abc",selected:!1},{id:"2",label:"xyz",selected:!1},{id:"3",label:"pqr",selected:!0}],onClick:s=>{s.preventDefault(),console.log("asdasd")}}};var t,a,n;l.parameters={...l.parameters,docs:{...(t=l.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    filterItems: [{
      id: '1',
      label: 'abc',
      selected: false
    }, {
      id: '2',
      label: 'xyz',
      selected: false
    }, {
      id: '3',
      label: 'pqr',
      selected: true
    }],
    onClick: e => {
      e.preventDefault();
      console.log('asdasd');
    }
  }
}`,...(n=(a=l.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};const g=["Default"];export{l as Default,g as __namedExportsOrder,k as default};
