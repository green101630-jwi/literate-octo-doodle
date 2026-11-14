(() => {
  'use strict';
  document.querySelectorAll('[data-hardware-comms]').forEach(root => {
    const tabs = [...root.querySelectorAll('[data-hc-tab]')];
    const panels = [...root.querySelectorAll('[data-hc-panel]')];
    if (!tabs.length || !panels.length) return;
    const values = {
      act: {accent:'#006b63',tint:'#edf6f4',network:'50 Hz',command:'50 Hz',returnEn:'1 action / reply',returnKo:'응답당 행동 1개'},
      diffusion: {accent:'#96600e',tint:'#fff6e7',network:'~50 Hz',command:'50 Hz',returnEn:'1 queued action / reply',returnKo:'응답당 큐 행동 1개'},
      smol: {accent:'#3f66aa',tint:'#eef3fb',network:'5.4–5.7 Hz',command:'30 Hz',returnEn:'50-action chunk / reply',returnKo:'응답당 50행동 청크'}
    };
    let selected='act';
    let phase=0;
    let timer=null;
    const lang=()=>document.documentElement.lang==='ko'?'ko':'en';
    const active=()=>panels.find(panel=>panel.dataset.hcPanel===selected);
    function stop(){if(timer!==null){clearInterval(timer);timer=null;}root.querySelectorAll('[data-hc-play]').forEach(button=>button.setAttribute('aria-pressed','false'));}
    function showPhase(){
      const panel=active();
      panel.querySelectorAll('[data-hc-phase]').forEach(block=>block.dataset.current=String(Number(block.dataset.hcPhase)===phase));
      const caption=panel.querySelector('[data-hc-caption]');
      const descriptions=[...panel.querySelectorAll('.hc-gpu-lane [data-hc-phase]')];
      caption.textContent=descriptions[phase].querySelector(`[data-step-${lang()}]`).getAttribute(`data-step-${lang()}`);
      panel.querySelector('[data-hc-play]').setAttribute('aria-pressed',String(timer!==null));
    }
    function select(name,focus=false){
      if(!values[name])return;
      stop();selected=name;phase=0;
      const config=values[name];
      root.style.setProperty('--hc-accent',config.accent);root.style.setProperty('--hc-tint',config.tint);
      tabs.forEach(tab=>{const chosen=tab.dataset.hcTab===name;tab.setAttribute('aria-selected',String(chosen));tab.tabIndex=chosen?0:-1;if(chosen&&focus)tab.focus();});
      panels.forEach(panel=>panel.hidden=panel.dataset.hcPanel!==name);
      root.querySelector('[data-hc-network]').textContent=config.network;
      root.querySelector('[data-hc-command]').textContent=config.command;
      root.querySelector('[data-hc-return]').textContent=config[lang()==='ko'?'returnKo':'returnEn'];
      showPhase();
    }
    root.querySelector('.hc-tabs').hidden=false;
    panels.forEach(panel=>{
      panel.querySelector('.hc-demo-controls').hidden=false;
      panel.querySelector('[data-hc-step]').addEventListener('click',()=>{stop();phase=(phase+1)%4;showPhase();});
      panel.querySelector('[data-hc-play]').addEventListener('click',()=>{if(timer!==null){stop();showPhase();return;}timer=setInterval(()=>{phase=(phase+1)%4;showPhase();},1500);showPhase();});
    });
    tabs.forEach((tab,index)=>{
      tab.addEventListener('click',()=>select(tab.dataset.hcTab));
      tab.addEventListener('keydown',event=>{
        let next;
        if(event.key==='ArrowRight')next=(index+1)%tabs.length;
        else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
        else if(event.key==='Home')next=0;
        else if(event.key==='End')next=tabs.length-1;
        else return;
        event.preventDefault();select(tabs[next].dataset.hcTab,true);
      });
    });
    new MutationObserver(()=>{
      root.querySelector('[data-hc-return]').textContent=values[selected][lang()==='ko'?'returnKo':'returnEn'];showPhase();
    }).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();showPhase();}});
    select('act');
    function revealLinkedPanel(){
      let id;
      try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      if(!id)return;
      const target=document.getElementById(id);
      const panel=target?.closest('[data-hc-panel]');
      if(!panel||!root.contains(panel))return;
      select(panel.dataset.hcPanel);
      requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'auto'}));
    }
    window.addEventListener('hashchange',revealLinkedPanel);
    revealLinkedPanel();
  });
})();
