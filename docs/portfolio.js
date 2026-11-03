(() => {
"use strict";
const KEY="wj-portfolio-language";
const languageButtons=Array.from(document.querySelectorAll("[data-language]"));
const titleNode=document.querySelector("title[data-title-en]");
function applyLanguage(language,persist){
  const value=language==="ko"?"ko":"en";
  document.documentElement.lang=value;
  document.documentElement.dataset.language=value;
  document.querySelectorAll("[data-alt-en][data-alt-ko]").forEach(node=>{node.alt=node.dataset[value==="ko"?"altKo":"altEn"]});
  if(titleNode) document.title=titleNode.dataset[value==="ko"?"titleKo":"titleEn"] || titleNode.textContent;
  languageButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.language===value)));
  if(persist){try{localStorage.setItem(KEY,value)}catch(_){}}
}
let saved="en";try{saved=localStorage.getItem(KEY)||"en"}catch(_){}
applyLanguage(saved,false);
languageButtons.forEach(button=>button.addEventListener("click",()=>applyLanguage(button.dataset.language,true)));
const menuButton=document.querySelector("[data-menu-toggle]");
const nav=document.querySelector("[data-site-nav]");
if(menuButton&&nav){
  const close=()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false")};
  menuButton.addEventListener("click",()=>{const open=menuButton.getAttribute("aria-expanded")!=="true";nav.classList.toggle("open",open);menuButton.setAttribute("aria-expanded",String(open))});
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",close));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
  window.addEventListener("resize",()=>{if(window.innerWidth>700)close()});
}
})();