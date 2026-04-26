const products = [
  {
    id: 1,
    name: "Soap",
    price: 50,
    image: "picturesinthecode/soap1.jpg",
    description: "Natural handmade soap.",
    gallery: [
      "picturesinthecode/soap2.jpg",
      "picturesinthecode/soap3.jpg"
    ]
  },
  {
    id: 2,
    name: "Dishwash",
    price: 100,
    image: "https://placehold.co/300x300?text=Dishwash&bg=ececec&fg=555",
    description: "Tough on grease, gentle on hands.",
    gallery: [
      "https://placehold.co/300x300?text=Dishwash1",
      "https://placehold.co/300x300?text=Dishwash2"
    ]
  }
];
// Render list of products
function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product">
      <a href="product-detail.html?id=${p.id}">
        <img src="${p.image}" width="100" />
        <h3 style="text-align: center; font-weight: bold;">${p.name}</h3>
        <p style="font-size: 18px; color: #d9534f; font-weight: bold;">Rs. ${p.price}</p>
      </a>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}
// Render product details on detail page
function renderProductDetail() {
  const detailDiv = document.getElementById("product-detail");
  if (!detailDiv) return;
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const product = products.find(p => p.id === id);
  if (!product) {
    detailDiv.innerHTML = `<p>Product not found.</p>`;
    return;
  }
  detailDiv.innerHTML = `
    <div class="product-detail-wrapper">
      <div class="image-gallery">
        ${product.gallery.map((img, i) => `
          <img src="${img}" onclick="openGallery(${product.id}, ${i})" />
        `).join("")}
      </div>
      <div class="product-info">
        <h1 class="detail-name">${product.name}</h1>
        <p class="detail-description"><strong>Description:</strong> ${product.description}</p>
        <p class="detail-price">Rs. ${product.price}</p>
        <div class="detail-actions">
          <input type="number" id="qty" value="1" min="1" />
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}
// Add product to cart
function addToCart(id) {
  const qtyInput = document.getElementById("qty") || document.getElementById(`qty-${id}`);
  const qty = parseInt(qtyInput?.value || "1");
  const product = products.find(p => p.id === id);
  if (!product) return;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
  renderCart();
}
// Render cart contents with quantity adjust & remove buttons
function renderCart() {
  const cartSection = document.querySelector(".cart-section");
  const cartTotalDiv = document.getElementById("cart-total");
  if (!cartSection || !cartTotalDiv) return;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartSection.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalDiv.innerHTML = "";
    return;
  }
  let total = 0;
  cartSection.innerHTML = cart.map((item, index) => {
    const itemTotal = item.qty * item.price;
    total += itemTotal;
    return `
      <div class="cart-item" data-index="${index}">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h3>${item.name}</h3>
          <label>Quantity: 
            <input type="number" min="1" value="${item.qty}" class="qty-input" data-index="${index}" />
          </label>
          <p>Price: Rs. ${item.price}</p>
          <p>Subtotal: Rs. ${itemTotal}</p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
  }).join("");
  cartTotalDiv.innerHTML = `Total: Rs. ${total}`;
  // Event listeners for quantity change
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const idx = parseInt(e.target.dataset.index);
      let newQty = parseInt(e.target.value);
      if (newQty < 1) newQty = 1;
      cart[idx].qty = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
  // Event listeners for remove buttons
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // Run only on signin.html
  if (window.location.pathname.includes("signin.html")) {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        // Save user info
        localStorage.setItem("username", name);
        localStorage.setItem("user", JSON.stringify({ email, password }));
        // Redirect to carticon page
        window.location.href = "carticon.html";
      });
    }
  }
});
// Show logged-in user and logout (hide/show signin/login links & display welcome+logout in banner)
function showUser() {
  const username = localStorage.getItem("username") || '';
  const userBanner = document.getElementById("user-banner");
  const signinLink = document.getElementById("nav-signin");
  const loginLink = document.getElementById("nav-login");
  if (!userBanner || !signinLink || !loginLink) return;
  if (username.trim() !== '') {
    signinLink.style.pointerEvents = "none";
    signinLink.style.opacity = "0.5";
    loginLink.style.pointerEvents = "none";
    loginLink.style.opacity = "0.5";
    userBanner.innerHTML = `
      Welcome, <strong>${username}</strong> |
      <a href="#" id="logout-link" 
         style="
           color: white; 
           background-color: #d9534f; 
           padding: 5px 10px; 
           border-radius: 5px; 
           text-decoration: none; 
           font-weight: bold; 
           cursor: pointer;
           box-shadow: 0 0 5px rgba(217, 83, 79, 0.7);
           transition: background-color 0.3s ease;
         "
         onmouseover="this.style.backgroundColor='#c9302c'"
         onmouseout="this.style.backgroundColor='#d9534f'"
      >Logout</a>
    `;
    document.getElementById("logout-link").onclick = () => {
      localStorage.removeItem("username");
      localStorage.removeItem("cart");
      window.location.href = "home.html";
    };
  } else {
    signinLink.style.pointerEvents = "auto";
    signinLink.style.opacity = "1";
    loginLink.style.pointerEvents = "auto";
    loginLink.style.opacity = "1";
    userBanner.innerHTML = '';
  }
}
// GALLERY MODAL FUNCTIONS
let currentGallery = [];
let currentIndex = 0;
function openGallery(productId, index) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  currentGallery = product.gallery || [product.image];
  currentIndex = index;
  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImage.src = currentGallery[currentIndex];
}
function closeGallery() {
  const modal = document.getElementById("galleryModal");
  modal.style.display = "none";
}
function prevImage(event) {
  event.stopPropagation();
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  document.getElementById("modalImage").src = currentGallery[currentIndex];
}
function nextImage(event) {
  event.stopPropagation();
  currentIndex = (currentIndex + 1) % currentGallery.length;
  document.getElementById("modalImage").src = currentGallery[currentIndex];
}
// Handle checkout with login check and redirect to signin page with returnUrl
function handleCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    if (!username || username.trim() === "") {
      alert("You must be logged in to place an order. Redirecting to Sign In page.");
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `signin.html?returnUrl=${currentUrl}`;
      return;
    }
    const fullName = document.getElementById("full-name").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment-method").value;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    const order = {
      username: fullName,
      address,
      payment,
      cart,
    };
    try {
      const response = await fetch("http://localhost:8000/place-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (response.ok) {
        localStorage.removeItem("cart");
        // Redirect to thank you page on success
        window.location.href = "thankyou.html";
      } else {
        document.getElementById("order-status").innerText = "❌ Failed to place order.";
      }
    } catch (error) {
      console.error("Error placing order:", error);
      document.getElementById("order-status").innerText = "❌ Server error.";
    }
  });
}
// Initialize everything on load
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderProductDetail();
  renderCart();
  showUser();
  handleCheckout();
});
