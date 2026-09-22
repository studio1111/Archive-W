const seedItems=[
{id:"hero-1",title:"Hero 1",cat:"Hero",author:"sshahaider",url:"https://21st.dev/community/components/sshahaider/hero-1",desc:"Hero component with dedicated source page.",tags:["Hero","Source"]},
{id:"scroll-video-hero",title:"Scroll Video Hero",cat:"Hero",author:"explore",url:"https://21st.dev/community/components/explore/nt-scroll-video-hero-prompt",desc:"Scroll-driven video hero source.",tags:["Hero","Video","Scroll","Source"]},
{id:"hero-button",title:"Hero Button Expendable",cat:"Hero",author:"shadway",url:"https://21st.dev/community/components/shadway/hero-button-expendable/default",desc:"Dedicated component source.",tags:["Hero","Button","Source"]},
{id:"card-avatar",title:"Card with Avatar",cat:"Card",author:"Hero UI",url:"https://21st.dev/%40hero_ui/components/heroui-card/with-avatar",desc:"Card component with avatar.",tags:["Card","Avatar","Source"]},
{id:"type-confirm",title:"Type to Confirm Dialog",cat:"Dialog",author:"uimix",url:"https://21st.dev/community/components/uimix/one-dialog/type-to-confirm",desc:"Dedicated dialog source.",tags:["Dialog","Modal","Source"]},
{id:"textarea-label",title:"Textarea with Label",cat:"Text Area",author:"jshguo",url:"https://21st.dev/community/components/jshguo/interfaces-textarea/with-label",desc:"Textarea source.",tags:["Text Area","Form","Source"]},
{id:"floating-label",title:"Floating Label",cat:"Input",author:"arihantcodes",url:"https://21st.dev/community/components/arihantcodes_1f7b8c4d/floating-label/default",desc:"Input source.",tags:["Input","Form","Source"]},
{id:"help-button",title:"Help Button",cat:"Button",author:"ln-dev7",url:"https://21st.dev/community/components/ln-dev7/help-button/default",desc:"Button source.",tags:["Button","Source"]},
{id:"file-trigger",title:"File Trigger",cat:"File Upload",author:"jollyshopland",url:"https://21st.dev/community/components/jollyshopland/file-trigger",desc:"File selection source.",tags:["File Upload","Source"]},
{id:"copy-button",title:"Copy Button Variants",cat:"Button",author:"qredence",url:"https://21st.dev/community/components/qredence/copy-button-variants/default",desc:"Copy button source.",tags:["Button","Clipboard","Source"]},
{id:"warning-note",title:"Warning Note",cat:"Notification",author:"shugar",url:"https://21st.dev/community/components/shugar/note/warning",desc:"Warning note source.",tags:["Notification","Alert","Source"]},
{id:"otp-dialog",title:"Verify Code OTP",cat:"Dialog",author:"felipemenezes098",url:"https://21st.dev/community/components/felipemenezes098/the-dialog/verify-code-otp",desc:"OTP dialog source.",tags:["Dialog","OTP","Auth","Source"]}
];

const grid=document.querySelector("#grid"), search=document.querySelector("#search"), filter=document.querySelector("#filter"), chips=document.querySelector("#categoryChips"), count=document.querySelector("#count"), modal=document.querySelector("#modal"), modalContent=document.querySelector("#modalContent");
let items=[...seedItems], catalogCategories=[];

const palette=["cyan","pink","violet","green"];
function visual(x,i){
  const tone=palette[i%palette.length];
  return `<a class="preview-link" href="${x.url}" target="_blank" rel="noopener" aria-label="Open ${x.title}">
    <div class="catalog-preview tone-${tone}">
      <div class="preview-grid"></div>
      <div class="preview-orb"></div>
      <div class="preview-window"><span></span><span></span><span></span><b>${x.cat||"UI"}</b><strong>${x.title}</strong><small>21st.dev source ↗</small></div>
    </div>
  </a>`;
}
function render(list){
  count.textContent=list.length;
  grid.innerHTML=list.map((x,i)=>`<article class="card glass"><div class="preview">${visual(x,i)}</div><div class="card-body"><div class="card-top"><span class="badge">${x.cat}</span><span class="badge">${x.author||"21st.dev"}</span></div><h3>${x.title}</h3><p>${x.desc||"رابط رسمی و نمایشی برای کشف این الگو."}</p><div class="meta">${(x.tags||[x.cat,"Preview","Source"]).map(t=>"<span>"+t+"</span>").join("")}</div><div class="card-actions"><button class="main" data-info="${x.id}">جزئیات</button><a href="${x.url}" target="_blank" rel="noopener">منبع ↗</a></div></div></article>`).join("");
  document.querySelectorAll("[data-info]").forEach(b=>b.onclick=()=>openItem(items.find(x=>x.id===b.dataset.info)));
}
function rebuildFilters(){
  chips.innerHTML=""; filter.innerHTML='<option value="all">همه دسته‌ها</option>';
  const cats=[...new Set(items.map(x=>x.cat))];
  cats.forEach(c=>{
    const o=document.createElement("option");o.value=c;o.textContent=c;filter.appendChild(o);
    const b=document.createElement("button");b.className="chip";b.textContent=c;b.onclick=()=>{filter.value=c;apply()};chips.appendChild(b);
  });
}
function openItem(x){
  if(!x)return;
  modalContent.innerHTML=`<span class="kicker">${x.cat}</span><h2>${x.title}</h2><div class="modal-preview">${visual(x,0)}</div><p style="color:var(--muted)">این کارت یک نمای بصری داخلی دارد و برای مشاهده نمونه، کد یا پرامپت اصلی به صفحه رسمی 21st.dev می‌رود.</p><div class="modal-links"><a href="${x.url}" target="_blank" rel="noopener">باز کردن منبع رسمی ↗</a></div>`;
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}
function apply(){
  const q=search.value.trim().toLowerCase(),f=filter.value;
  render(items.filter(x=>(f==="all"||x.cat===f)&&(!q||(x.title+" "+x.cat+" "+(x.desc||"")+" "+(x.tags||[]).join(" ")).toLowerCase().includes(q))));
}
document.addEventListener("click",e=>{if(e.target.matches("[data-close]")){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("open")});
search.oninput=apply;filter.onchange=apply;
document.querySelector("#themeBtn").onclick=()=>document.body.classList.toggle("dim");

async function loadCatalog(){
  try{
    const res=await fetch("data/catalog.json",{cache:"no-store"});
    if(!res.ok)throw new Error("catalog");
    const data=await res.json();
    catalogCategories=data.categories||[];
    const categoryItems=catalogCategories.map((c,i)=>({
      id:"catalog-"+i,title:c[0],cat:"Category",desc:`${c[2].toLocaleString()}+ نمونه در این دسته، طبق کاتالوگ منتشرشده.`,
      author:"21st.dev",url:c[1],tags:["Category","Preview","Source"]
    }));
    items=[...seedItems,...categoryItems];
  }catch(e){
    items=[...seedItems];
  }
  rebuildFilters();apply();
}
loadCatalog();
