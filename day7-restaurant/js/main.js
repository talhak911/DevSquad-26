import { products, reviews, similarRestaurants } from "./data.js";

// DOM Elements
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartBadge = document.getElementById("cart-badge");
const cartTotalEl = document.getElementById("cart-total");

// State
let cart = [];

function init() {
  renderProducts();
  renderReviews();
  renderSimilarRestaurants();
  setupEventListeners();
  updateCartUI();
}

function renderProducts() {
  const container = document.getElementById("menu-container");
  if (!container) return;

  // Group products by type
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.type]) acc[product.type] = [];
    acc[product.type].push(product);
    return acc;
  }, {});

  let html = "";

  for (const [type, items] of Object.entries(groupedProducts)) {
    // Capitalize type for title
    const title = type.charAt(0).toUpperCase() + type.slice(1);

    let itemsHtml = items
      .map(
        (p) => `
      <div class="bg-white border text-left border-border rounded-xl p-4 flex justify-between gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
         <div class="flex-1 flex flex-col justify-between">
            <div>
               <h4 class="font-bold text-lg mb-1">${p.name}</h4>
               <p class="text-sm text-text-muted line-clamp-2">${p.description}</p>
            </div>
            <p class="font-bold mt-4">${p.currency} ${p.price.toFixed(2)}</p>
         </div>
         
         <div class="relative w-32 h-32 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
            
            <!-- Adding to base html, positioning Add button at bottom right corner -->
         </div>
         <!-- Add button directly on the card -->
         <button class="absolute -bottom-2 -right-2 bg-white text-black hover:bg-black hover:text-white border shadow-md w-12 h-12 rounded-tl-xl flex justify-center items-center text-2xl transition-all duration-300 z-10 font-bold group-hover:bg-primary group-hover:text-white" onclick="window.app.addToCart(${p.id})">
            +
         </button>
      </div>
    `,
      )
      .join("");

    html += `
      <section id="${type.replace(" ", "-")}">
         <h2 class="text-3xl font-bold mb-6 text-primary">${title}</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${itemsHtml}
         </div>
      </section>
    `;
  }

  container.innerHTML = html;
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  container.innerHTML = reviews
    .map(
      (r) => `
    <div class="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between shrink-0 w-full md:w-[calc(33.333%-1rem)] snap-center">
       <div>
         <div class="flex justify-between items-start mb-4 border-b border-border pb-4">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 rounded-full ring-2 ring-primary/20 overflow-hidden shrink-0">
                  <img src="${r.image}" alt="${r.name}" class="w-full h-full object-cover">
               </div>
               <div>
                  <h4 class="font-bold text-base whitespace-nowrap">${r.name}</h4>
                  <p class="text-xs text-primary font-semibold mb-1">${r.location}</p>
               </div>
            </div>
            <div class="text-right">
               <div class="flex text-primary text-xs mb-1 justify-end gap-0.5">
                 ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
               </div>
               <span class="text-[10px] sm:text-xs font-semibold text-gray-500 whitespace-nowrap"><i class="fa-regular fa-clock"></i> ${r.date}</span>
            </div>
         </div>
         <p class="text-sm text-gray-700 italic leading-relaxed">"${r.text}"</p>
       </div>
    </div>
  `,
    )
    .join("");
}

function renderSimilarRestaurants() {
  const container = document.getElementById("similar-restaurants-container");
  if (!container) return;

  container.innerHTML = similarRestaurants
    .map(
      (r) => `
    <div class="group relative bg-white rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer flex flex-col aspect-4/5 sm:aspect-square">
       <div class="flex-1 p-6 flex items-center justify-center bg-white relative z-10">
         <img src="${r.image}" alt="${r.name}" class="h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-300">
       </div>
       <div class="bg-primary text-white text-center py-4 font-bold text-sm sm:text-base flex items-center xl:whitespace-nowrap sm:whitespace-normal justify-center z-10 border-t-2 border-white">
         ${r.name}
       </div>
       <!-- bg decor -->
       <div class="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  `,
    )
    .join("");
}

function setupEventListeners() {
  // Empty space click closes modal
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.classList.add("hidden");
    }
  });

  const prevBtn = document.getElementById("prev-review");
  const nextBtn = document.getElementById("next-review");
  const reviewsContainer = document.getElementById("reviews-container");

  if (prevBtn && reviewsContainer) {
    prevBtn.addEventListener("click", () => {
      reviewsContainer.scrollBy({
        left: -reviewsContainer.clientWidth,
        behavior: "smooth",
      });
    });
  }

  if (nextBtn && reviewsContainer) {
    nextBtn.addEventListener("click", () => {
      reviewsContainer.scrollBy({
        left: reviewsContainer.clientWidth,
        behavior: "smooth",
      });
    });
  }

  cartIcon?.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
  });

  closeCartBtn?.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
  });
}

export function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

export function updateQuantity(productId, delta) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
    }
  }
}

function updateCartUI() {
  // Update badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    if (totalItems > 0) cartBadge.classList.remove("hidden");
    else cartBadge.classList.add("hidden");
  }

  // Update total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  if (cartTotalEl) {
    cartTotalEl.textContent = `£${totalPrice.toFixed(2)}`;
  }

  // Render items
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = "";
    cart.forEach((item) => {
      const el = document.createElement("div");
      el.className =
        "flex items-center justify-between p-4 bg-gray-100/50 rounded-xl mb-2 items-stretch";
      el.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="h-14 w-14 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-gray-100">
             <img src="${item.image}" alt="${item.name}" class="h-full object-cover p-1">
          </div>
          <div>
            <h4 class="font-bold text-base text-black">${item.name}</h4>
            <p class="text-sm font-semibold text-text-muted mt-1">£${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg hover:bg-primary transition-colors" onclick="window.app.updateQuantity(${item.id}, -1)">
             <i class="fa-solid fa-minus text-xs"></i>
          </button>
          <span class="font-bold w-6 text-center text-lg">${item.quantity}</span>
          <button class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg hover:bg-primary transition-colors" onclick="window.app.updateQuantity(${item.id}, 1)">
             <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>
      `;
      cartItemsContainer.appendChild(el);
    });

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="text-center text-text-muted py-8 font-semibold">Your cart is empty.</p>';
    }
  }
}

// Expose to window for inline onclick handlers if needed
window.app = { addToCart, updateQuantity, removeFromCart };

document.addEventListener("DOMContentLoaded", init);
