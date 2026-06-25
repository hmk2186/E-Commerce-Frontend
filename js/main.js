// Core/Shared JavaScript for E-Commerce Frontend

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbarScroll();
  updateBadges();
  initBackToTop();
  createToastContainer();
});

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  
  // Setup theme toggle buttons (can be multiple on screen)
  const toggleButtons = document.querySelectorAll(".theme-toggle-btn");
  toggleButtons.forEach(btn => {
    updateThemeIcon(btn, savedTheme);
    btn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-bs-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      
      document.documentElement.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      
      toggleButtons.forEach(b => updateThemeIcon(b, newTheme));
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, "info");
    });
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector("i");
  if (icon) {
    if (theme === "dark") {
      icon.className = "bi bi-sun-fill";
    } else {
      icon.className = "bi bi-moon-fill";
    }
  }
}

/* ==========================================================================
   Navbar Scroll Effect
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector(".glass-header");
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Check on load
}

/* ==========================================================================
   LocalStorage Cart & Wishlist Operations
   ========================================================================== */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBadges();
}

function addToCart(productId, quantity = 1, showNotification = true) {
  const cart = getCart();
  const product = getProductById(productId);
  
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantity
    });
  }

  saveCart(cart);
  if (showNotification) {
    showToast(`Added "${product.name}" to cart!`, "success");
  }
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateBadges();
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const index = wishlist.findIndex(id => id === productId);
  const product = getProductById(productId);

  if (!product) return false;

  let added = false;
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`Removed "${product.name}" from wishlist.`, "info");
  } else {
    wishlist.push(productId);
    showToast(`Added "${product.name}" to wishlist!`, "success");
    added = true;
  }

  saveWishlist(wishlist);
  
  // Dispatch a custom event to notify other scripts that wishlist updated
  window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { id: productId, active: added } }));
  return added;
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

function updateBadges() {
  const cartCountBadges = document.querySelectorAll(".badge-cart-count");
  const wishlistCountBadges = document.querySelectorAll(".badge-wishlist-count");

  // Cart total items
  const cart = getCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountBadges.forEach(badge => {
    badge.textContent = cartItemCount;
    badge.style.display = cartItemCount > 0 ? "block" : "none";
  });

  // Wishlist count
  const wishlist = getWishlist();
  const wishCount = wishlist.length;
  wishlistCountBadges.forEach(badge => {
    badge.textContent = wishCount;
    badge.style.display = wishCount > 0 ? "block" : "none";
  });
}

/* ==========================================================================
   Custom Toast Notifications
   ========================================================================== */
function createToastContainer() {
  if (!document.getElementById("custom-toast-container")) {
    const container = document.createElement("div");
    container.id = "custom-toast-container";
    container.className = "toast-container-custom";
    document.body.appendChild(container);
  }
}

function showToast(message, type = "success") {
  const container = document.getElementById("custom-toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "custom-toast";

  let iconClass = "bi-check-circle-fill";
  if (type === "info") iconClass = "bi-info-circle-fill";
  if (type === "danger") iconClass = "bi-exclamation-circle-fill";

  toast.innerHTML = `
    <span class="toast-icon ${type}"><i class="bi ${iconClass}"></i></span>
    <span class="toast-message">${message}</span>
    <button class="toast-close"><i class="bi bi-x"></i></button>
  `;

  container.appendChild(toast);

  // Close event listener
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    dismissToast(toast);
  });

  // Auto-dismiss
  setTimeout(() => {
    dismissToast(toast);
  }, 4000);
}

function dismissToast(toast) {
  toast.classList.add("hide");
  toast.addEventListener("transitionend", () => {
    toast.remove();
  });
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  let btn = document.querySelector(".back-to-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.innerHTML = `<i class="bi bi-arrow-up"></i>`;
    document.body.appendChild(btn);
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
