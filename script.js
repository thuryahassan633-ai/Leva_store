const products = [
  {id:1,name:"توزيعات التخرج الكلاسيكية",price:15,cat:"grad",emoji:"🎓",desc:"توزيعات أنيقة للتخرج قابلة للتخصيص بالاسم والعبارة."},
  {id:2,name:"توزيعات استقبال المواليد",price:12,cat:"birth",emoji:"🧸",desc:"تفاصيل لطيفة لاستقبال المولود مع إمكانية اختيار الألوان."},
  {id:3,name:"توزيعات المناسبات",price:10,cat:"gifts",emoji:"🎁",desc:"توزيعات ناعمة للمناسبات السعيدة بتفاصيل ليڤـا."},
  {id:4,name:"لوحات فنية وديكور",price:150,cat:"gifts",emoji:"🖼️",desc:"لوحات ديكور فنية بلمسة ثلاثية الأبعاد وتصاميم خاصة."},
  {id:5,name:"بروشات تخرج مخصصة",price:18,cat:"grad",emoji:"🏅",desc:"بروشات بأسماء الخريجين وتصاميم تناسب المناسبة."},
  {id:6,name:"علب استقبال مواليد",price:25,cat:"birth",emoji:"🎀",desc:"علبة استقبال متكاملة بتفاصيل ناعمة."},
  {id:7,name:"هدايا مناسبات",price:35,cat:"gifts",emoji:"💝",desc:"هدية جاهزة أو مخصصة حسب مناسبتك."},
  {id:8,name:"تصميم خاص",price:50,cat:"gifts",emoji:"🦋",desc:"فكرة خاصة بك تتحول إلى تصميم يحمل تفاصيل مناسبتك."}
];

let cart = JSON.parse(localStorage.getItem("levaCart") || "[]");

const productsEl = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");

function renderProducts(filter="all"){
  const list = filter==="all" ? products : products.filter(p=>p.cat===filter);
  productsEl.innerHTML = list.map(p=>`
    <article class="product">
      <div class="product-img" onclick="openProduct(${p.id})">${p.emoji}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <div class="price">${p.price} ر.س</div>
        <div class="product-actions">
          <button class="add" onclick="addToCart(${p.id})">أضف للسلة 🛍</button>
          <button class="details" onclick="openProduct(${p.id})">التفاصيل</button>
        </div>
      </div>
    </article>`).join("");
}
function save(){localStorage.setItem("levaCart",JSON.stringify(cart)); updateCart();}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  save(); openCart();
}
function updateCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  cartCount.textContent=count;
  if(!cart.length){
    cartItems.innerHTML='<div class="empty">سلتك فارغة حاليًا ♡<br>اختاري شيئًا جميلًا ليڤـا.</div>';
  }else{
    cartItems.innerHTML=cart.map(x=>{
      const p=products.find(y=>y.id===x.id);
      return `<div class="cart-line">
        <div class="cart-thumb">${p.emoji}</div>
        <div><h4>${p.name}</h4><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div>
        <div><b>${p.price*x.qty} ر.س</b><br><button class="remove" onclick="removeItem(${p.id})">حذف</button></div>
      </div>`;
    }).join("");
  }
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  cartTotal.textContent=`${total} ر.س`;
}
function changeQty(id,n){const x=cart.find(i=>i.id===id);x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()}
function removeItem(id){cart=cart.filter(i=>i.id!==id);save()}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show")}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show")}
function openProduct(id){
  const p=products.find(x=>x.id===id);
  modalContent.innerHTML=`<div class="modal-content"><div class="modal-img">${p.emoji}</div><div><span class="mini-title">Leva | ليڤـا</span><h2>${p.name}</h2><p>${p.desc}</p><h3 class="price">${p.price} ر.س</h3><button class="btn" onclick="addToCart(${p.id});closeModal()">أضيفيه للسلة 🛍</button></div></div>`;
  modal.classList.add("show");overlay.classList.add("show");
}
function closeModal(){modal.classList.remove("show");overlay.classList.remove("show")}

document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");renderProducts(b.dataset.filter);
}));
document.querySelectorAll("[data-filter]").forEach(a=>a.addEventListener("click",e=>{
  const f=a.dataset.filter;
  if(f){document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===f));renderProducts(f);}
}));
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("closeModal").onclick=closeModal;
overlay.onclick=()=>{closeCart();closeModal()};
document.getElementById("checkout").onclick=()=>{
  if(!cart.length){alert("السلة فارغة");return}
  const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `• ${p.name} × ${x.qty} = ${p.price*x.qty} ر.س`}).join("\n");
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  const msg=`مرحبًا Leva 🌷 أود طلب:\n${lines}\n\nالإجمالي: ${total} ر.س\nأرغب بتأكيد الطلب.`;
  window.open(`https://wa.me/966533817655?text=${encodeURIComponent(msg)}`,"_blank");
};
document.getElementById("searchBtn").onclick=()=>{
  const q=prompt("اكتبي اسم المنتج الذي تبحثين عنه:");
  if(!q)return;
  const found=products.filter(p=>p.name.includes(q.trim()));
  productsEl.innerHTML=found.length ? found.map(p=>`
    <article class="product"><div class="product-img" onclick="openProduct(${p.id})">${p.emoji}</div><div class="product-body"><h3>${p.name}</h3><div class="price">${p.price} ر.س</div><div class="product-actions"><button class="add" onclick="addToCart(${p.id})">أضف للسلة 🛍</button><button class="details" onclick="openProduct(${p.id})">التفاصيل</button></div></div></article>`).join("") : '<p>لم نجد منتجًا بهذا الاسم.</p>';
};
renderProducts();updateCart();
