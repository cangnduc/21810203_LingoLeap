import{a7 as i,j as t}from"./index-DVmOQZrp.js";function d(){const[a,{isLoading:s}]=i(),o=async n=>{n.preventDefault();const e=new FormData(n.target);await a(e)};return t.jsxs("div",{children:[t.jsx("h1",{children:"Upload Sound File"}),t.jsxs("form",{onSubmit:o,children:[t.jsx("input",{type:"file",name:"soundFile",accept:"audio/*"}),t.jsx("button",{type:"submit",children:"Upload"})]})]})}export{d as default};