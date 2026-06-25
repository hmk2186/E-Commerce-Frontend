// Wishlist Page Script

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();

  // Listen to wishlist updates from outside
  window.addEventListener("wishlistUpdated", (e) => {
    // If an item is toggled off from another page element, we re-render
    renderWishlist();
  });
});

/* ==========================================================================
   Render Wishlist Products Grid
   ========================================================================== */
function renderWishlist() {
  const wishlist = getWishlist();
  const grid = document.getElementById("wishlist-grid");
  const emptyState = document.getElementById("wishlist-empty-state");

  if (!grid) return;

  if (wishlist.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  let html = "";
  wishlist.forEach(id => {
    const prod = getProductById(id);
    if (!prod) return; // skip if invalid ID

    const ratingCount = Math.round(prod.rating);
    let starHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingCount) {
        starHtml += '<i class="bi bi-star-fill"></i>';
      } else {
        starHtml += '<i class="bi bi-star"></i>';
      }
    }

    const badgeHtml = prod.badge 
      ? `<span class="product-badge bg-primary text-white">${prod.badge}</span>` 
      : '';

    html += `
      <div class="col-sm-6 col-md-4 col-lg-3 wishlist-card-wrapper" data-id="${prod.id}">
        <div class="product-card">
          ${badgeHtml}
          <!-- Close/Remove Button Overlay -->
          <div class="wishlist-btn-overlay active" title="Remove from Wishlist" onclick="event.preventDefault(); removeFromWishlistLocal(${prod.id})">
            <i class="bi bi-x-lg fs-6"></i>
          </div>
          
          <a href="product-details.html?id=${prod.id}" class="product-image-wrapper">
            <img src="${prod.image}" alt="${prod.name}">
          </a>
          
          <div class="product-card-body">
            <span class="product-category">${prod.category}</span>
            <a href="product-details.html?id=${prod.id}" class="product-title fw-bold">${prod.name}</a>
            <div class="rating-stars">
              ${starHtml} <span class="text-secondary small ms-1">(${prod.rating})</span>
            </div>
            
            <div class="product-card-footer mt-auto pt-3 border-top border-light-subtle">
              <span class="product-price fs-5">$${prod.price.toFixed(2)}</span>
              <button class="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1" onclick="moveToCartLocal(${prod.id})">
                <i class="bi bi-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

/* ==========================================================================
   Wishlist Page Handlers
   ========================================================================== */
window.removeFromWishlistLocal = function(id) {
  // Toggle wishlist removes it since it already exists
  toggleWishlist(id);
  
  // Animate card removal in UI
  const wrapper = document.querySelector(`.wishlist-card-wrapper[data-id="${id}"]`);
  if (wrapper) {
    wrapper.style.transition = "opacity 0.3s, transform 0.3s";
    wrapper.style.opacity = "0";
    wrapper.style.transform = "scale(0.9)";
    
    setTimeout(() => {
      renderWishlist();
    }, 300);
  } else {
    renderWishlist();
  }
};

window.moveToCartLocal = function(id) {
  // 1. Add to cart
  addToCart(id, 1, false);
  
  // 2. Remove from Wishlist
  toggleWishlist(id);
  
  // 3. Inform user with specific toast
  const prod = getProductById(id);
  const prodName = prod ? prod.name : "Product";
  showToast(`Moved "${prodName}" to shopping cart!`, "success");
  
  // 4. Animate card removal
  const wrapper = document.querySelector(`.wishlist-card-wrapper[data-id="${id}"]`);
  if (wrapper) {
    wrapper.style.transition = "opacity 0.3s, transform 0.3s";
    wrapper.style.opacity = "0";
    wrapper.style.transform = "scale(0.9)";
    
    setTimeout(() => {
      renderWishlist();
    }, 300);
  } else {
    renderWishlist();
  }
};
