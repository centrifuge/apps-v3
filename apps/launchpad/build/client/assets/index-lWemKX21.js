import{i as d,r as u,l as p,j as m,x as f}from"./index-DNyRCIwI.js";import{n as h,c as g}from"./if-defined-BWU6qkaf.js";const v=d`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var c=function(o,t,r,s){var l=arguments.length,e=l<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,r):s,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(o,t,r,s);else for(var a=o.length-1;a>=0;a--)(n=o[a])&&(e=(l<3?n(e):l>3?n(t,r,e):n(t,r))||e);return l>3&&e&&Object.defineProperty(t,r,e),e};let i=class extends m{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,f`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};i.styles=[u,p,v];c([h()],i.prototype,"src",void 0);c([h()],i.prototype,"alt",void 0);c([h()],i.prototype,"size",void 0);i=c([g("wui-image")],i);
