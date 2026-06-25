// Product Details Page Script

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));

  if (!productId || isNaN(productId)) {
    renderNotFound();
    return;
  }

  const product = getProductById(productId);
  if (!product) {
    renderNotFound();
    return;
  }

  renderProductDetails(product);
  renderRelatedProductsGrid(product);
  initQuantityControls(product);
  initDetailWishlistButton(product);
  initAddToCartButton(product);

  // Sync wishlist updates
  window.addEventListener("wishlistUpdated", (e) => {
    if (e.detail.id === product.id) {
      updateWishlistBtnUI(e.detail.active);
    }
    
    // Also sync related product cards
    const relatedCards = document.querySelectorAll(`.wishlist-btn-overlay[data-id="${e.detail.id}"]`);
    relatedCards.forEach(card => {
      if (e.detail.active) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  });
});

/* ==========================================================================
   Product Detail Rendering
   ========================================================================== */
function renderProductDetails(product) {
  // Breadcrumb
  const breadcrumb = document.getElementById("details-breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <li class="breadcrumb-item"><a href="index.html" class="text-decoration-none">Home</a></li>
      <li class="breadcrumb-item"><a href="products.html" class="text-decoration-none">Products</a></li>
      <li class="breadcrumb-item"><a href="products.html?category=${encodeURIComponent(product.category)}" class="text-decoration-none">${product.category}</a></li>
      <li class="breadcrumb-item active" aria-current="page">${product.name}</li>
    `;
  }

  // Image & Badge
  document.getElementById("p-detail-image").src = product.image;
  document.getElementById("p-detail-image").alt = product.name;
  
  const badge = document.getElementById("p-detail-badge");
  if (product.badge) {
    badge.textContent = product.badge;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }

  // Text details
  document.getElementById("p-detail-category").textContent = product.category;
  document.getElementById("p-detail-name").textContent = product.name;
  document.getElementById("p-detail-price").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("p-detail-description").textContent = product.description;

  // Stock
  const stockBadge = document.getElementById("p-detail-stock");
  if (product.stock > 0) {
    stockBadge.textContent = `In Stock (${product.stock} left)`;
    stockBadge.className = "badge bg-success-subtle text-success border border-success-subtle px-2 py-1";
  } else {
    stockBadge.textContent = "Out of Stock";
    stockBadge.className = "badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1";
    
    // Disable Add to Cart elements
    document.getElementById("btn-add-cart-detail").disabled = true;
    document.getElementById("qty-minus").disabled = true;
    document.getElementById("qty-plus").disabled = true;
    document.getElementById("qty-input").disabled = true;
  }

  // Star Ratings
  const starsContainer = document.getElementById("p-detail-stars");
  const roundedRating = Math.round(product.rating);
  let starHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      starHtml += '<i class="bi bi-star-fill"></i>';
    } else {
      starHtml += '<i class="bi bi-star"></i>';
    }
  }
  starsContainer.innerHTML = starHtml;
  document.getElementById("p-detail-rating-text").textContent = `(${product.rating} Rating)`;

  // Features List
  const featuresList = document.getElementById("p-detail-features");
  featuresList.innerHTML = product.features.map(feat => `
    <li class="list-group-item bg-transparent px-0 text-secondary border-light-subtle d-flex align-items-start gap-2">
      <i class="bi bi-check2-circle text-primary mt-1"></i>
      <span>${feat}</span>
    </li>
  `).join("");
}

function renderNotFound() {
  const main = document.getElementById("product-details-section");
  if (main) {
    main.innerHTML = `
      <div class="container text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1 text-danger d-block mb-3"></i>
        <h2 class="fw-bold">Product Not Found</h2>
        <p class="text-secondary">The product you are trying to view does not exist or has been removed.</p>
        <a href="products.html" class="btn btn-primary rounded-pill mt-3">Back to Store Catalog</a>
      </div>
    `;
  }
}

/* ==========================================================================
   Quantity Controls
   ========================================================================== */
function initQuantityControls(product) {
  const minusBtn = document.getElementById("qty-minus");
  const plusBtn = document.getElementById("qty-plus");
  const qtyInput = document.getElementById("qty-input");

  if (!minusBtn || !plusBtn || !qtyInput) return;

  // Set maximum input based on available stock
  qtyInput.setAttribute("max", product.stock);

  minusBtn.addEventListener("click", () => {
    let currentVal = parseInt(qtyInput.value);
    if (currentVal > 1) {
      qtyInput.value = currentVal - 1;
    }
  });

  plusBtn.addEventListener("click", () => {
    let currentVal = parseInt(qtyInput.value);
    if (currentVal < product.stock) {
      qtyInput.value = currentVal + 1;
    }
  });

  qtyInput.addEventListener("change", () => {
    let val = parseInt(qtyInput.value);
    if (isNaN(val) || val < 1) {
      qtyInput.value = 1;
    } else if (val > product.stock) {
      qtyInput.value = product.stock;
    }
  });
}

/* ==========================================================================
   Wishlist Interaction
   ========================================================================== */
function initDetailWishlistButton(product) {
  const btn = document.getElementById("btn-add-wishlist-detail");
  if (!btn) return;

  const active = isInWishlist(product.id);
  updateWishlistBtnUI(active);

  btn.addEventListener("click", () => {
    toggleWishlist(product.id);
  });
}

function updateWishlistBtnUI(isActive) {
  const btn = document.getElementById("btn-add-wishlist-detail");
  if (!btn) return;

  const icon = btn.querySelector("i");
  if (isActive) {
    btn.className = "btn btn-danger btn-lg px-3 rounded-circle d-flex align-items-center justify-content-center";
    icon.className = "bi bi-heart-fill";
  } else {
    btn.className = "btn btn-outline-danger btn-lg px-3 rounded-circle d-flex align-items-center justify-content-center";
    icon.className = "bi bi-heart";
  }
}

/* ==========================================================================
   Add To Cart Event
   ========================================================================== */
function initAddToCartButton(product) {
  const btn = document.getElementById("btn-add-cart-detail");
  const qtyInput = document.getElementById("qty-input");

  if (!btn || !qtyInput) return;

  btn.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);
    if (qty > 0) {
      addToCart(product.id, qty);
    }
  });
}

/* ==========================================================================
   Related Products Rendering
   ========================================================================== */
function renderRelatedProductsGrid(product) {
  const grid = document.getElementById("related-products-grid");
  if (!grid) return;

  const related = getRelatedProducts(product.id, product.category);
  if (related.length === 0) {
    grid.closest("section").style.display = "none";
    return;
  }

  let html = "";
  related.forEach(prod => {
    const isFav = isInWishlist(prod.id);
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
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="product-card">
          ${badgeHtml}
          <div class="wishlist-btn-overlay ${isFav ? 'active' : ''}" data-id="${prod.id}" onclick="event.preventDefault(); toggleWishlistLocalRelated(${prod.id})">
            <i class="bi bi-heart-fill"></i>
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
            <div class="product-card-footer">
              <span class="product-price">$${prod.price.toFixed(2)}</span>
              <button class="btn-add-to-cart" onclick="event.preventDefault(); addToCart(${prod.id}, 1)" aria-label="Add to cart">
                <i class="bi bi-cart-plus fs-5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function toggleWishlistLocalRelated(id) {
  const btn = document.querySelector(`.wishlist-btn-overlay[data-id="${id}"]`);
  const isActive = toggleWishlist(id);
  if (btn) {
    if (isActive) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  }
}
