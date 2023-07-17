"use strict";(self.webpackChunkreact_redux_rxjs_typescript=self.webpackChunkreact_redux_rxjs_typescript||[]).push([[560],{99956:(e,t,r)=>{r.d(t,{Z:()=>G});var n=r(93433),o=r(87462),l=r(19668);function a(e,t){var r={};return Object.keys(e).forEach((function(n){-1===t.indexOf(n)&&(r[n]=e[n])})),r}function p(e){var t=function(t){var r=e(t);return t.css?(0,o.Z)({},(0,l.Z)(r,e((0,o.Z)({theme:t.theme},t.css))),a(t.css,[e.filterProps])):t.sx?(0,o.Z)({},(0,l.Z)(r,e((0,o.Z)({theme:t.theme},t.sx))),a(t.sx,[e.filterProps])):r};return t.propTypes={},t.filterProps=["css","sx"].concat((0,n.Z)(e.filterProps)),t}const i=p;const c=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=function(e){return t.reduce((function(t,r){var n=r(e);return n?(0,l.Z)(t,n):t}),{})};return n.propTypes={},n.filterProps=t.reduce((function(e,t){return e.concat(t.filterProps)}),[]),n};var s=r(4942),m=r(71410);function u(e,t){return t&&"string"==typeof t?t.split(".").reduce((function(e,t){return e&&e[t]?e[t]:null}),e):null}const f=function(e){var t=e.prop,r=e.cssProperty,n=void 0===r?e.prop:r,o=e.themeKey,l=e.transform,a=function(e){if(null==e[t])return null;var r=e[t],a=u(e.theme,o)||{};return(0,m.k)(e,r,(function(e){var t;return"function"==typeof a?t=a(e):Array.isArray(a)?t=a[e]||e:(t=u(a,e)||e,l&&(t=l(t))),!1===n?t:(0,s.Z)({},n,t)}))};return a.propTypes={},a.filterProps=[t],a};function d(e){return"number"!=typeof e?e:"".concat(e,"px solid")}const h=c(f({prop:"border",themeKey:"borders",transform:d}),f({prop:"borderTop",themeKey:"borders",transform:d}),f({prop:"borderRight",themeKey:"borders",transform:d}),f({prop:"borderBottom",themeKey:"borders",transform:d}),f({prop:"borderLeft",themeKey:"borders",transform:d}),f({prop:"borderColor",themeKey:"palette"}),f({prop:"borderRadius",themeKey:"shape"}));const E=c(f({prop:"displayPrint",cssProperty:!1,transform:function(e){return{"@media print":{display:e}}}}),f({prop:"display"}),f({prop:"overflow"}),f({prop:"textOverflow"}),f({prop:"visibility"}),f({prop:"whiteSpace"}));const y=c(f({prop:"flexBasis"}),f({prop:"flexDirection"}),f({prop:"flexWrap"}),f({prop:"justifyContent"}),f({prop:"alignItems"}),f({prop:"alignContent"}),f({prop:"order"}),f({prop:"flex"}),f({prop:"flexGrow"}),f({prop:"flexShrink"}),f({prop:"alignSelf"}),f({prop:"justifyItems"}),f({prop:"justifySelf"}));const Z=c(f({prop:"gridGap"}),f({prop:"gridColumnGap"}),f({prop:"gridRowGap"}),f({prop:"gridColumn"}),f({prop:"gridRow"}),f({prop:"gridAutoFlow"}),f({prop:"gridAutoColumns"}),f({prop:"gridAutoRows"}),f({prop:"gridTemplateColumns"}),f({prop:"gridTemplateRows"}),f({prop:"gridTemplateAreas"}),f({prop:"gridArea"}));const v=c(f({prop:"position"}),f({prop:"zIndex",themeKey:"zIndex"}),f({prop:"top"}),f({prop:"right"}),f({prop:"bottom"}),f({prop:"left"}));const g=c(f({prop:"color",themeKey:"palette"}),f({prop:"bgcolor",cssProperty:"backgroundColor",themeKey:"palette"}));const b=f({prop:"boxShadow",themeKey:"shadows"});function x(e){return e<=1?"".concat(100*e,"%"):e}var S=f({prop:"width",transform:x}),w=f({prop:"maxWidth",transform:x}),P=f({prop:"minWidth",transform:x}),C=f({prop:"height",transform:x}),T=f({prop:"maxHeight",transform:x}),A=f({prop:"minHeight",transform:x});f({prop:"size",cssProperty:"width",transform:x}),f({prop:"size",cssProperty:"height",transform:x});const K=c(S,w,P,C,T,A,f({prop:"boxSizing"}));var N=r(38681);const k=c(f({prop:"fontFamily",themeKey:"typography"}),f({prop:"fontSize",themeKey:"typography"}),f({prop:"fontStyle",themeKey:"typography"}),f({prop:"fontWeight",themeKey:"typography"}),f({prop:"letterSpacing"}),f({prop:"lineHeight"}),f({prop:"textAlign"}));var I=r(45987),R=r(67294),W=r(86010),L=r(8679),O=r.n(L),_=r(30115);function M(e,t){var r={};return Object.keys(e).forEach((function(n){-1===t.indexOf(n)&&(r[n]=e[n])})),r}var j=r(99700);const z=function(e){var t=function(e){return function(t){var r,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},l=n.name,a=(0,I.Z)(n,["name"]),p=l,i="function"==typeof t?function(e){return{root:function(r){return t((0,o.Z)({theme:e},r))}}}:{root:t},c=(0,_.Z)(i,(0,o.Z)({Component:e,name:l||e.displayName,classNamePrefix:p},a));t.filterProps&&(r=t.filterProps,delete t.filterProps),t.propTypes&&(t.propTypes,delete t.propTypes);var s=R.forwardRef((function(t,n){var l=t.children,a=t.className,p=t.clone,i=t.component,s=(0,I.Z)(t,["children","className","clone","component"]),m=c(t),u=(0,W.Z)(m.root,a),f=s;if(r&&(f=M(f,r)),p)return R.cloneElement(l,(0,o.Z)({className:(0,W.Z)(l.props.className,u)},f));if("function"==typeof l)return l((0,o.Z)({className:u},f));var d=i||e;return R.createElement(d,(0,o.Z)({ref:n,className:u},f),l)}));return O()(s,e),s}}(e);return function(e,r){return t(e,(0,o.Z)({defaultTheme:j.Z},r))}};var F=i(c(h,E,y,Z,v,g,b,K,N.Z,k));const G=z("div")(F,{name:"MuiBox"})},29560:(e,t,r)=>{r.r(t),r.d(t,{default:()=>L});var n=r(67294),o=r(41120),l=r(41749),a=r(82302),p=r(99613),i=r(88222),c=r(56847),s=r(83750),m=r(57394),u=r(79895),f=r(17812),d=r(59067),h=r(95998),E=r(97230);var y=r(20573);const Z=(0,y.P1)((e=>e.user),(e=>e.isLoading)),v=(0,y.P1)((e=>e.user),(e=>e.items));var g=r(7104),b=r(16450),x=r(282),S=r(52663),w=r(66856),P=r(29525),C=r(99956),T=r(22318),A=r(39803),K=r(43700),N=r(85639),k=r(64436),I=r(26209);function R({isOpen:e,handleCloseEditModal:t,user:r,handleSaveUser:o}){const[a]=n.useState(r);return n.createElement(n.Fragment,null,n.createElement(S.Z,{fullWidth:!0,maxWidth:"sm",open:e,"aria-labelledby":"max-width-dialog-title"},n.createElement(P.Z,null,n.createElement(T.Z,{variant:"h6",color:"textPrimary"},"Edit user roles"),n.createElement("br",null),n.createElement(l.Z,{container:!0,spacing:2},n.createElement(l.Z,{item:!0,xs:12},n.createElement(A.Z,{fullWidth:!0,id:"title",label:"Title",variant:"outlined"})),n.createElement(l.Z,{item:!0,xs:12},n.createElement(A.Z,{fullWidth:!0,id:"author",label:"Author",variant:"outlined"})),n.createElement(l.Z,{item:!0,xs:12},n.createElement(k.Z,{fullWidth:!0,variant:"outlined"},n.createElement(K.Z,{id:"demo-simple-select-outlined-label"},"Severity"),n.createElement(I.Z,{fullWidth:!0,labelId:"demo-simple-select-outlined-label",id:"demo-simple-select-outlined",label:"Severity",value:"low"},n.createElement(N.Z,{value:""},n.createElement("em",null,"None")),n.createElement(N.Z,{value:"low"},"Low"),n.createElement(N.Z,{value:"medium"},"Medium"),n.createElement(N.Z,{value:"high"},"High"))))),n.createElement(C.Z,{mt:2},n.createElement(T.Z,{variant:"subtitle1",color:"textPrimary"},n.createElement(b.c,null,"DESCRIPTION")),n.createElement(A.Z,{multiline:!0,rows:6,fullWidth:!0,variant:"outlined",placeholder:"Leave a message"}))),n.createElement(w.Z,null,n.createElement(x.Z,{onClick:t,color:"primary"},n.createElement(b.c,null,"CLOSE")),n.createElement(x.Z,{onClick:()=>o(a),variant:"contained",color:"primary",size:"small"},n.createElement(b.c,null,"SAVE")))))}const W=(0,o.Z)({table:{minWidth:650}});function L(){const e=W(),t=(0,h.I0)();n.useEffect((()=>{t({type:E.F.LIST_ALL_REQUEST})}),[t]);const r=(0,h.v9)(Z),o=(0,h.v9)(v),[y,x]=n.useState(null);return r?n.createElement(g.CircularProgress,null):n.createElement(n.Fragment,null,n.createElement(l.Z,{container:!0,alignItems:"center"},n.createElement(l.Z,{item:!0,sm:8},n.createElement("h2",null,n.createElement(b.c,null,"USERS")))),n.createElement(c.Z,{component:u.Z},n.createElement(a.Z,{className:e.table,"aria-label":"simple table"},n.createElement(s.Z,null,n.createElement(m.Z,null,n.createElement(i.Z,null,n.createElement(b.c,null,"FIRST_NAME")),n.createElement(i.Z,null,n.createElement(b.c,null,"LAST_NAME")),n.createElement(i.Z,null,n.createElement(b.c,null,"EMAIL")),n.createElement(i.Z,null,"Roles (Institution : role) "),n.createElement(i.Z,null,"Login Type"),n.createElement(i.Z,null,n.createElement(b.c,null,"ACTION")))),n.createElement(p.Z,null,o.map((e=>n.createElement(m.Z,{key:e.id},n.createElement(i.Z,{component:"th",scope:"row"},e.firstName),n.createElement(i.Z,null,e.lastName),n.createElement(i.Z,null,e.email),n.createElement(i.Z,null,e.roleMappings.map(((e,t)=>n.createElement(g.Chip,{key:t,color:"info",label:`${e.institution.name} : ${e.role.name}`})))),n.createElement(i.Z,null,e.loginType),n.createElement(i.Z,null,n.createElement(f.Z,{onClick:()=>x(e),color:"primary","aria-label":"edit user",component:"span"},n.createElement(d.Z,null))))))))),n.createElement(R,{isOpen:!!y,user:y,handleCloseEditModal:function(){x(null)},handleSaveUser:function(){x(null)}}))}}}]);