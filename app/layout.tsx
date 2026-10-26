import "./globals.css";
import { orbitron, roboto } from "@/lib/fonts";

// Lets the page draw under the notch and home bar, so the safe-area insets used by the phone menu are real values
export const viewport = {
  viewportFit: "cover",
};

export const metadata = {
  title: "Fredy · Portfolio",
  description:
    "Fredy is a UI/UX designer and front-end developer. Explore selected projects, about, and contact.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${roboto.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  document.write('<style id="portfolio-boot">html{background:#000}body{visibility:hidden}</style>');
  var PREFIX="portfolio-scroll:";
  var AWAY=48;
  function key(){return PREFIX+location.pathname}
  var stored=NaN;
  try{stored=Number(sessionStorage.getItem(key()))}catch(e){}
  if(!(stored>AWAY)){
    try{if(history.state&&Number.isFinite(history.state.portfolioScroll))stored=history.state.portfolioScroll}catch(e){}
  }
  var away=Number.isFinite(stored)&&stored>AWAY;
  var y=away?stored:0;
  window.__portfolioScrollY=y;
  window.__portfolioHoldScroll=away;
  var root=document.documentElement;
  var holding=away;
  var userMoved=false;
  var revealed=!away;
  var layouts={};
  var placing=false;
  var sheet=document.createElement("style");
  function write(value){
    try{sessionStorage.setItem(key(),String(Math.round(value)))}catch(e){}
    // Also kept in the history entry, which survives a reload even when sessionStorage is blocked
    try{history.replaceState(Object.assign({},history.state,{portfolioScroll:Math.round(value)}),"")}catch(e){}
  }
  var queued=false;
  function queueWrite(){
    if(queued||holding)return;
    queued=true;
    requestAnimationFrame(function(){
      queued=false;
      if(!holding)write(window.scrollY);
    });
  }
  if(!away){
    var boot=document.getElementById("portfolio-boot");
    if(boot)boot.remove();
    var nav=performance.getEntriesByType("navigation")[0];
    if(nav&&nav.type==="reload"){
      sheet.textContent="html,body{scroll-behavior:auto!important}";
      document.head.appendChild(sheet);
      window.addEventListener("load",function(){sheet.remove()});
    }
    window.addEventListener("scroll",queueWrite,{passive:true});
    window.addEventListener("pagehide",function(){write(window.scrollY)});
    return;
  }
  if("scrollRestoration" in history)history.scrollRestoration="manual";
  sheet.textContent="html,body{scroll-behavior:auto!important}html{background:#000!important}body{visibility:hidden!important}";
  document.head.appendChild(sheet);
  function place(){
    if(placing||!holding||userMoved)return;
    if("scrollRestoration" in history)history.scrollRestoration="manual";
    var max=root.scrollHeight-window.innerHeight;
    if(max+1<y)return;
    if(Math.abs(window.scrollY-y)>1){
      placing=true;
      window.scrollTo({top:y,left:0,behavior:"instant"});
      placing=false;
    }
  }
  var guardTimer=0;
  function reveal(fromUser){
    if(revealed)return;
    revealed=true;
    holding=false;
    window.__portfolioHoldScroll=false;
    if(!fromUser){
      var max=root.scrollHeight-window.innerHeight;
      if(max+1>=y){
        placing=true;
        window.scrollTo({top:y,left:0,behavior:"instant"});
        placing=false;
      }
    }
    window.dispatchEvent(new Event("portfolio-reveal"));
    var bootStyle=document.getElementById("portfolio-boot");
    if(bootStyle)bootStyle.remove();
    sheet.textContent="html,body{scroll-behavior:auto!important}";
    write(fromUser?window.scrollY:y);
    var until=performance.now()+2500;
    var guard=function(){
      if(userMoved||performance.now()>until){
        sheet.remove();
        window.removeEventListener("scroll",guard);
        return;
      }
      if(Math.abs(window.scrollY-y)>1){
        placing=true;
        window.scrollTo({top:y,left:0,behavior:"instant"});
        placing=false;
      }
    };
    window.addEventListener("scroll",guard,{passive:true});
    guardTimer=window.setInterval(function(){
      guard();
      if(userMoved||performance.now()>until)window.clearInterval(guardTimer);
    },50);
  }
  function onUserScroll(event){
    if(userMoved)return;
    if(event.type==="keydown"){
      var k=event.key;
      if(k!=="ArrowDown"&&k!=="ArrowUp"&&k!=="PageDown"&&k!=="PageUp"&&k!=="Home"&&k!=="End"&&k!==" ")return;
    }
    userMoved=true;
    holding=false;
    window.__portfolioHoldScroll=false;
    reveal(true);
  }
  window.addEventListener("wheel",onUserScroll,{passive:true,capture:true});
  window.addEventListener("touchmove",onUserScroll,{passive:true,capture:true});
  window.addEventListener("keydown",onUserScroll,{capture:true});
  var stable=0;
  function maybeReveal(){
    if(revealed)return;
    place();
    var home=location.pathname==="/";
    var ready=!home||(layouts.about&&layouts.projects);
    var max=root.scrollHeight-window.innerHeight;
    if(!(ready&&max+1>=y&&Math.abs(window.scrollY-y)<=1)){
      stable=0;
      return;
    }
    stable+=1;
    if(stable>=2)reveal(false);
  }
  var ticks=0;
  function tick(){
    if(revealed)return;
    ticks+=1;
    maybeReveal();
    if(!revealed){
      if(ticks>40)reveal(false);
      else window.setTimeout(tick,32);
    }
  }
  window.setTimeout(tick,0);
  window.addEventListener("portfolio-layout",function(event){
    if(event.detail)layouts[event.detail]=true;
    maybeReveal();
    window.setTimeout(maybeReveal,0);
  });
  window.addEventListener("scroll",function(){
    if(holding)place();
    else queueWrite();
  },{passive:true});
  window.addEventListener("pagehide",function(){
    write(holding&&!userMoved?y:window.scrollY);
  });
  document.addEventListener("DOMContentLoaded",place);
})();`,
          }}
        />
      </head>
      <body className="bg-white text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
