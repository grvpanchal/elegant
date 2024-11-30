import{x as c}from"./lit-element-CBvJUqC2.js";import"./app-button-dWzH9IzQ.js";import"./useComputedStyles-DPZnygVX.js";import"./app-loader-CzuIFrWV.js";import"./emit-DOoe1CjV.js";const g={title:"Atoms/Button",render:o=>c`<app-button .classes="${o.classes}" .isLoading="${o.isLoading}" @onClick="${o.onClick}">${o.label}</app-button>`},e={args:{classes:"button primary",label:"Sample Button",onClick:o=>console.log("click",o.detail)}},t={args:{isLoading:!0,classes:"button primary",label:"Sample Button"}};var a,s,r;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    classes: 'button primary',
    label: 'Sample Button',
    onClick: e => console.log('click', e.detail)
  }
}`,...(r=(s=e.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};var n,l,i;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    isLoading: true,
    classes: 'button primary',
    label: 'Sample Button'
  }
}`,...(i=(l=t.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const k=["Default","Loading"];export{e as Default,t as Loading,k as __namedExportsOrder,g as default};
