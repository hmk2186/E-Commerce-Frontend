// Products Listing Script

document.addEventListener("DOMContentLoaded", () => {
  // Sync desktop and mobile filters on interaction
  syncFilters();
  
  // Load initial filters from URL params
  loadFiltersFromUrl();
  
  // Render products matching filter
  applyFiltersAndRender();
  
  // Hook up event listeners for filters
  setupEventListeners();

  // Listen to wishlist updates from outside (like details page or home)
  window.addEventListener("wishlistUpdated", (e) => {
    const cards = document.querySelectorAll(`.wishlist-btn-overlay[data-id="${e.detail.id}"]`);
    cards.forEach(card => {
      if (e.detail.active) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  });
});

// Filters State Object
const state = {
  search: "",
  categories: ["All"],
  maxPrice: 1000,
  sortBy: "default"
};

/* ==========================================================================
   Sync Desktop and Mobile Controls
   ========================================================================== */
function syncFilters() {
  const dSearch = document.getElementById("search-input");
  const mSearch = document.getElementById("mobile-search-input");
  const dRange = document.getElementById("price-range");
  const mRange = document.getElementById("mobile-price-range");
  const dPriceVal = document.getElementById("price-val");
  const mPriceVal = document.getElementById("mobile-price-val");

  // Sync Search Inputs
  dSearch.addEventListener("input", (e) => {
    mSearch.value = e.target.value;
    state.search = e.target.value;
    applyFiltersAndRender();
  });
  mSearch.addEventListener("input", (e) => {
    dSearch.value = e.target.value;
    state.search = e.target.value;
    applyFiltersAndRender();
  });

  // Sync Price Ranges
  dRange.addEventListener("input", (e) => {
    mRange.value = e.target.value;
    dPriceVal.textContent = `$${e.target.value}`;
    mPriceVal.textContent = `$${e.target.value}`;
    state.maxPrice = parseInt(e.target.value);
    applyFiltersAndRender();
  });
  mRange.addEventListener("input", (e) => {
    dRange.value = e.target.value;
    dPriceVal.textContent = `$${e.target.value}`;
    mPriceVal.textContent = `$${e.target.value}`;
    state.maxPrice = parseInt(e.target.value);
    applyFiltersAndRender();
  });

  // Sync Category Checkboxes
  const dCheckboxes = document.querySelectorAll(".category-checkbox");
  const mCheckboxes = document.querySelectorAll(".mobile-category-checkbox");

  dCheckboxes.forEach(chk => {
    chk.addEventListener("change", (e) => {
      const val = e.target.value;
      const mChk = document.querySelector(`.mobile-category-checkbox[value="${val}"]`);
      if (mChk) mChk.checked = e.target.checked;
      updateCategoryState();
      applyFiltersAndRender();
    });
  });

  mCheckboxes.forEach(chk => {
    chk.addEventListener("change", (e) => {
      const val = e.target.value;
      const dChk = document.querySelector(`.category-checkbox[value="${val}"]`);
      if (dChk) dChk.checked = e.target.checked;
      updateCategoryState();
      applyFiltersAndRender();
    });
  });
}

function updateCategoryState() {
  const checkedBoxes = document.querySelectorAll(".category-checkbox:checked");
  const vals = Array.from(checkedBoxes).map(cb => cb.value);
  
  // If nothing is selected, check 'All'
  if (vals.length === 0) {
    document.getElementById("cat-all").checked = true;
    document.getElementById("m-cat-all").checked = true;
    state.categories = ["All"];
    return;
  }

  // If we just selected a category other than 'All', uncheck 'All'
  const lastSelected = vals[vals.length - 1];
  const allIndex = vals.indexOf("All");

  if (lastSelected !== "All" && allIndex > -1) {
    document.getElementById("cat-all").checked = false;
    document.getElementById("m-cat-all").checked = false;
    vals.splice(allIndex, 1);
  } else if (lastSelected === "All") {
    // If 'All' was selected, uncheck everything else
    const dCheckboxes = document.querySelectorAll(".category-checkbox");
    const mCheckboxes = document.querySelectorAll(".mobile-category-checkbox");
    dCheckboxes.forEach(cb => cb.checked = cb.value === "All");
    mCheckboxes.forEach(cb => cb.checked = cb.value === "All");
    state.categories = ["All"];
    return;
  }

  state.categories = vals;
}

/* ==========================================================================
   Load Parameters from URL
   ========================================================================== */
function loadFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  
  // Category Parameter
  const categoryParam = params.get("category");
  if (categoryParam) {
    // Uncheck "All"
    document.getElementById("cat-all").checked = false;
    document.getElementById("m-cat-all").checked = false;
    
    // Check specific
    const dChk = document.querySelector(`.category-checkbox[value="${categoryParam}"]`);
    const mChk = document.querySelector(`.mobile-category-checkbox[value="${categoryParam}"]`);
    if (dChk) dChk.checked = true;
    if (mChk) mChk.checked = true;
    
    state.categories = [categoryParam];
  }

  // Search Parameter
  const searchParam = params.get("search");
  if (searchParam) {
    document.getElementById("search-input").value = searchParam;
    document.getElementById("mobile-search-input").value = searchParam;
    state.search = searchParam;
  }
}

/* ==========================================================================
   Event Listeners
   ========================================================================== */
function setupEventListeners() {
  // Sort selection
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    applyFiltersAndRender();
  });

  // Clear filters
  const clearBtn = document.getElementById("clear-filters-btn");
  const mClearBtn = document.getElementById("mobile-clear-filters-btn");
  const resetEmptyBtn = document.getElementById("empty-state-reset");

  const clearAll = () => {
    document.getElementById("search-input").value = "";
    document.getElementById("mobile-search-input").value = "";
    state.search = "";

    const dCheckboxes = document.querySelectorAll(".category-checkbox");
    const mCheckboxes = document.querySelectorAll(".mobile-category-checkbox");
    dCheckboxes.forEach(cb => cb.checked = cb.value === "All");
    mCheckboxes.forEach(cb => cb.checked = cb.value === "All");
    state.categories = ["All"];

    const maxPriceVal = 1000;
    document.getElementById("price-range").value = maxPriceVal;
    document.getElementById("mobile-price-range").value = maxPriceVal;
    document.getElementById("price-val").textContent = `$${maxPriceVal}`;
    document.getElementById("mobile-price-val").textContent = `$${maxPriceVal}`;
    state.maxPrice = maxPriceVal;

    sortSelect.value = "default";
    state.sortBy = "default";

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);

    applyFiltersAndRender();
  };

  clearBtn.addEventListener("click", clearAll);
  mClearBtn.addEventListener("click", clearAll);
  resetEmptyBtn.addEventListener("click", clearAll);
}

/* ==========================================================================
   Filter and Render Logic
   ========================================================================== */
function applyFiltersAndRender() {
  let filtered = [...products];

  // 1. Category Filter
  if (!state.categories.includes("All") && state.categories.length > 0) {
    filtered = filtered.filter(p => state.categories.includes(p.category));
  }

  // 2. Price Filter
  filtered = filtered.filter(p => p.price <= state.maxPrice);

  // 3. Search Filter
  if (state.search.trim() !== "") {
    const q = state.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  // 4. Sorting
  if (state.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Render Grid
  renderProductsGrid(filtered);
}

function renderProductsGrid(items) {
  const grid = document.getElementById("products-grid");
  const countSpan = document.getElementById("product-results-count");
  const emptyState = document.getElementById("empty-state");

  if (!grid) return;

  countSpan.textContent = items.length;

  if (items.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  let html = "";
  items.forEach(prod => {
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
      <div class="col-sm-6 col-md-6 col-lg-4">
        <div class="product-card">
          ${badgeHtml}
          <div class="wishlist-btn-overlay ${isFav ? 'active' : ''}" data-id="${prod.id}" onclick="event.preventDefault(); toggleWishlistLocal(${prod.id})">
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

function toggleWishlistLocal(id) {
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
