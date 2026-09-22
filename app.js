const seedItems=[[]];

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
