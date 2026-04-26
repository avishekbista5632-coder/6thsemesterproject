/* main.js - unified site logic (products, cart, auth, gallery, checkout) */

const products = [
  {
    id: 1,
    name: "Soap",
    price: 50,
    image: "picturesinthecode/soap1.jpg",
    description: "Natural handmade soap.",
    gallery: [
      "picturesinthecode/soap1.jpg",
      "picturesinthecode/soap2.jpg",
      "picturesinthecode/soap3.jpg"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/600x400?text=Dishwash",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/600x400?text=Dishwash+1",
      "https://placehold.co/600x400?text=Dishwash+2"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/600x400?text=Dishwash",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/600x400?text=Dishwash+1",
      "https://placehold.co/600x400?text=Dishwash+2"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/600x400?text=Dishwash",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/600x400?text=Dishwash+1",
      "https://placehold.co/600x400?text=Dishwash+2"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/600x400?text=Dishwash",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/600x400?text=Dishwash+1",
      "https://placehold.co/600x400?text=Dishwash+2"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/600x400?text=Dishwash",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/600x400?text=Dishwash+1",
      "https://placehold.co/600x400?text=Dishwash+2"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/600x400?text=Dishwash",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/600x400?text=Dishwash+1",
      "https://placehold.co/600x400?text=Dishwash+2"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/600x400?text=Dishwash",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/600x400?text=Dishwash+1",
      "https://placehold.co/600x400?text=Dishwash+2"
    ]
  }
];

/* ---------- Utility ---------- */
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

/* ---------- PRODUCTS ---------- */
function renderProductsGrid(targetId = "product-list", limit = 0) {
  const container = document.getElementById(targetId);
  if (!container) return;
  const list = limit > 0 ? products.slice(0, limit) : products;
  container.innerHTML = list.map(p => `
    <div class="product-card">
      <a href="product-detail.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p class="price">Rs. ${p.price}</p>
      </a>
      <button class="btn-cart" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

/* ---------- PRODUCT DETAIL ---------- */
function renderProductDetail() {
  const detailContainer = document.getElementById("product-detail");
  if (!detailContainer) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  const p = products.find(x => x.id === id);
  if (!p) { detailContainer.innerHTML = "<p>Product not found.</p>"; return; }

  detailContainer.innerHTML = `
    <div class="product-detail-wrapper container">
      <div style="display:flex; gap:12px; flex-direction:column;">
        <img src="${p.image}" alt="${p.name}" style="width:320px; height:320px; object-fit:cover; border-radius:10px;" />
        <div class="image-gallery">
          ${p.gallery.map((g,i) => `<img src="${g}" alt="${p.name} ${i}" onclick="openGallery(${p.id}, ${i})">`).join("")}
        </div>
      </div>
      <div class="product-info">
        <h2 class="detail-name">${p.name}</h2>
        <p class="detail-description">${p.description}</p>
        <p class="detail-price">Rs. ${p.price}</p>
        <div class="detail-actions">
          <input type="number" id="qty" min="1" value="1" />
          <button class="btn-cart" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
    <div id="galleryModal" class="modal" onclick="closeGallery()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <img id="modalImage" src="" alt="gallery" />
      </div>
    </div>
  `;
}

/* ---------- CART ---------- */
function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
function setCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function addToCart(id) {
  const qtyInput = document.getElementById("qty") || document.getElementById(`qty-${id}`);
  const qty = Math.max(1, parseInt(qtyInput?.value || 1, 10));
  const product = products.find(p => p.id === id);
  if (!product) return alert("Product not found.");
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
  setCart(cart);
  showToast("Added to cart");
  renderCart(); // update cart page if open
}

/* ---------- RENDER CART PAGE ---------- */
function renderCart() {
  const cartSection = document.querySelector(".cart-section");
  const cartTotal = document.getElementById("cart-total");
  if (!cartSection || !cartTotal) return;
  const cart = getCart();
  if (!cart.length) {
    cartSection.innerHTML = "<p class='center small-muted'>Your cart is empty.</p>";
    cartTotal.innerHTML = "";
    return;
  }
  let total = 0;
  cartSection.innerHTML = cart.map((item, idx) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-item" data-index="${idx}">
        <img src="${item.image}" alt="${item.name}">
        <div style="flex:1">
          <h3 style="margin:0 0 6px 0">${item.name}</h3>
          <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
            <label>Qty
              <input class="qty-input" data-index="${idx}" type="number" min="1" value="${item.qty}">
            </label>
            <button class="btn-cart remove-btn" data-index="${idx}">Remove</button>
          </div>
          <p style="margin:0">Price: Rs. ${item.price}</p>
          <p style="margin:0; font-weight:700">Subtotal: Rs. ${subtotal}</p>
        </div>
      </div>
    `;
  }).join("");
  cartTotal.innerHTML = `Total: Rs. ${total}`;

  // bind events
  $all(".qty-input").forEach(input => {
    input.onchange = (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      let newQty = Math.max(1, parseInt(e.target.value, 10) || 1);
      const cart = getCart();
      cart[idx].qty = newQty;
      setCart(cart);
      renderCart();
    };
  });
  $all(".remove-btn").forEach(btn => btn.onclick = (e) => {
    const idx = parseInt(e.target.dataset.index, 10);
    const cart = getCart();
    cart.splice(idx,1);
    setCart(cart);
    renderCart();
  });
}

/* ---------- AUTH (simple localStorage) ---------- */
function initAuthForms() {
  // signin form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = signupForm.querySelector("#name").value.trim();
      const email = signupForm.querySelector("#email").value.trim();
      const password = signupForm.querySelector("#password").value;
      if (!name || !email || !password) return alert("Please fill all fields.");
      localStorage.setItem("username", name);
      localStorage.setItem("user", JSON.stringify({ email, password }));
      showToast("Signup successful");
      // redirect to previous or cart
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get("returnUrl") || "carticon.html";
      window.location.href = returnUrl;
    });
  }

  // login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector("#login-email").value.trim();
      const password = loginForm.querySelector("#login-password").value;
      const saved = JSON.parse(localStorage.getItem("user") || "null");
      if (!saved || saved.email !== email || saved.password !== password) {
        return alert("Invalid credentials. If you are new, please sign up.");
      }
      localStorage.setItem("username", localStorage.getItem("username") || "Customer");
      showToast("Logged in");
      window.location.href = "home.html";
    });
  }
}

/* ---------- SHOW USER IN HEADER ---------- */
function showUser() {
  const username = localStorage.getItem("username") || "";
  const signinLink = document.getElementById("nav-signin");
  const loginLink = document.getElementById("nav-login");

  // Remove existing corner banner if exists
  const oldBanner = document.querySelector(".user-banner-corner");
  if (oldBanner) oldBanner.remove();

  if (username.trim()) {
    // Disable login/signin links
    if (signinLink) { signinLink.style.pointerEvents = "none"; signinLink.style.opacity = "0.45"; }
    if (loginLink) { loginLink.style.pointerEvents = "none"; loginLink.style.opacity = "0.45"; }

    // Create corner banner
    const banner = document.createElement("div");
    banner.className = "user-banner-corner";
    banner.innerHTML = `Welcome, <strong>${username}</strong> <a href="#" id="logout-link">Logout</a>`;
    document.body.appendChild(banner);

    // Logout functionality
    const logout = document.getElementById("logout-link");
    logout.onclick = (ev) => {
      ev.preventDefault();
      localStorage.removeItem("username");
      banner.remove();
      showToast("Logged out");
      window.location.href = "home.html";
    };
  } else {
    // Enable login/signin links if no user
    if (signinLink) { signinLink.style.pointerEvents = "auto"; signinLink.style.opacity = "1"; }
    if (loginLink) { loginLink.style.pointerEvents = "auto"; loginLink.style.opacity = "1"; }
  }
}


/* ---------- GALLERY MODAL ---------- */
let currentGallery = []; let currentIndex = 0;
function openGallery(productId, index) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  currentGallery = p.gallery || [p.image];
  currentIndex = index || 0;
  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("modalImage");
  if (modal && modalImage) {
    modal.style.display = "flex";
    modalImage.src = currentGallery[currentIndex];
  }
}
function closeGallery() { const modal = document.getElementById("galleryModal"); if (modal) modal.style.display = "none"; }
function prevImage(e) { e.stopPropagation(); currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; document.getElementById("modalImage").src = currentGallery[currentIndex]; }
function nextImage(e) { e.stopPropagation(); currentIndex = (currentIndex + 1) % currentGallery.length; document.getElementById("modalImage").src = currentGallery[currentIndex]; }

/* ---------- CHECKOUT ---------- */
function handleCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    if (!username) {
      alert("Please sign in before placing order.");
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `signin.html?returnUrl=${currentUrl}`;
      return;
    }
    const fullName = form.querySelector("#full-name").value.trim();
    const address = form.querySelector("#address").value.trim();
    const payment = form.querySelector("#payment-method").value;
    const cart = getCart();
    if (!cart.length) return alert("Cart is empty.");
    // Simulate server call (or you can call your backend)
    try {
      // example: await fetch('/api/order', { method:'POST', body:JSON.stringify({fullName,address,payment,cart}) });
      localStorage.removeItem("cart");
      showToast("Order placed");
      window.location.href = "thankyou.html";
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  });
}

/* ---------- TOAST ---------- */
function showToast(msg = '', ms = 900) {
  let t = document.getElementById("site-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "site-toast";
    Object.assign(t.style, { position:"fixed", right:"18px", bottom:"18px", background:"#222", color:"#fff", padding:"10px 14px", borderRadius:"8px", zIndex:9999, opacity:0, transition:"opacity .18s" });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = 1;
  setTimeout(()=> t.style.opacity = 0, ms);
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

/* ---------- INIT on DOMContentLoaded ---------- */
window.addEventListener("DOMContentLoaded", () => {
  // Render product lists where applicable
  renderProductsGrid("product-list");
  renderProductsGrid("product-grid", 4); // if some pages have product-grid id
  renderProductDetail();
  renderCart();
  initAuthForms();
  showUser();
  handleCheckoutForm();

  // Close modal when clicking outside image (delegation)
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("galleryModal");
    if (modal && e.target === modal) closeGallery();
  });
});
