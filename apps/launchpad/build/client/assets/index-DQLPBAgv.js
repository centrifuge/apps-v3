import{i as p,j as u,x as d}from"./index-DNyRCIwI.js";import{n as f,r as b,c as g}from"./if-defined-BWU6qkaf.js";import{T as l}from"./index-CSSRPHyH.js";import{R as m,M}from"./root-quzbZdsK.js";const T={interpolate(i,e,o){if(i.length!==2||e.length!==2)throw new Error("inputRange and outputRange must be an array of length 2");const n=i[0]||0,r=i[1]||0,t=e[0]||0,s=e[1]||0;return o<n?t:o>r?s:(s-t)/(r-n)*(o-n)+t}},v=p`
  :host {
    width: 100%;
    display: block;
  }
`;var a=function(i,e,o,n){var r=arguments.length,t=r<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,e,o,n);else for(var c=i.length-1;c>=0;c--)(s=i[c])&&(t=(r<3?s(t):r>3?s(e,o,t):s(e,o))||t);return r>3&&t&&Object.defineProperty(e,o,t),t};let h=class extends u{constructor(){super(),this.unsubscribe=[],this.text="",this.open=l.state.open,this.unsubscribe.push(m.subscribeKey("view",()=>{l.hide()}),M.subscribeKey("open",e=>{e||l.hide()}),l.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),l.hide()}render(){return d`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return d`<slot></slot> `}onMouseEnter(){const e=this.getBoundingClientRect();this.open||l.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||l.hide()}};h.styles=[v];a([f()],h.prototype,"text",void 0);a([b()],h.prototype,"open",void 0);h=a([g("w3m-tooltip-trigger")],h);export{T as M};
