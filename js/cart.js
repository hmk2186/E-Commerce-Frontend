// Shopping Cart Logic Script

let discountRate = 0.0; // 10% would be 0.1

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  setupPromoCode();
  setupCheckout();
});

/* ==========================================================================
   Render Cart Items & Summary
   ========================================================================== */
function renderCart() {
  const cart = getCart();
  const mainRow = document.getElementById("cart-main-row");
  const emptyState = document.getElementById("cart-empty-state");
  const itemsHolder = document.getElementById("cart-items-holder");

  if (!itemsHolder) return;

  if (cart.length === 0) {
    if (mainRow) mainRow.classList.add("d-none");
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (mainRow) mainRow.classList.remove("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  let html = "";
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    
    html += `
      <div class="row align-items-center py-4 border-bottom g-3 cart-item-row" data-id="${item.id}">
        <!-- Product Info -->
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-3">
            <a href="product-details.html?id=${item.id}">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            </a>
            <div>
              <span class="text-primary fw-bold text-uppercase small" style="font-size: 0.7rem;">${item.category}</span>
              <a href="product-details.html?id=${item.id}" class="d-block fw-bold text-decoration-none text-primary fs-6 lh-sm">${item.name}</a>
              <button class="btn btn-sm text-danger p-0 mt-1 d-flex align-items-center gap-1" onclick="removeCartItemLocal(${item.id})">
                <i class="bi bi-trash-fill"></i> <span class="small">Remove</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Price -->
        <div class="col-4 col-md-2 text-md-center">
          <span class="text-muted d-md-none small block">Price:</span>
          <span class="fw-semibold">$${item.price.toFixed(2)}</span>
        </div>
        
        <!-- Quantity -->
        <div class="col-8 col-md-2 d-flex justify-content-md-center">
          <div class="qty-selector">
            <button class="qty-btn" onclick="updateQtyLocal(${item.id}, -1)" aria-label="Decrease Quantity"><i class="bi bi-dash"></i></button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" onchange="inputQtyLocal(${item.id}, this.value)" aria-label="Quantity">
            <button class="qty-btn" onclick="updateQtyLocal(${item.id}, 1)" aria-label="Increase Quantity"><i class="bi bi-plus"></i></button>
          </div>
        </div>
        
        <!-- Subtotal -->
        <div class="col-12 col-md-2 text-md-end text-end mt-2 mt-md-0">
          <span class="text-muted d-md-none small block">Total:</span>
          <span class="fw-bold text-primary">$${itemTotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  });

  itemsHolder.innerHTML = html;
  calculateSummary();
}

function calculateSummary() {
  const cart = getCart();
  
  // Calculate raw subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Apply Coupon Discount if set
  const discount = subtotal * discountRate;
  const discountedSubtotal = subtotal - discount;

  // Shipping Rules: Free shipping on orders >= $99, else flat $9.99
  const shipping = (subtotal === 0 || discountedSubtotal >= 99.00) ? 0.00 : 9.99;
  
  // 8% Estimated Tax
  const tax = discountedSubtotal * 0.08;
  
  // Grand Total
  const total = discountedSubtotal + shipping + tax;

  // Render to DOM
  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("cart-shipping").textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
  document.getElementById("cart-tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
}

/* ==========================================================================
   Quantity & Remove Handlers
   ========================================================================== */
window.updateQtyLocal = function(productId, direction) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  const targetQty = item.quantity + direction;
  const productInfo = getProductById(productId); // check mock stock limit

  if (targetQty < 1) {
    removeCartItemLocal(productId);
    return;
  }
  
  if (productInfo && targetQty > productInfo.stock) {
    showToast(`Sorry, only ${productInfo.stock} units available in stock.`, "danger");
    return;
  }

  item.quantity = targetQty;
  saveCart(cart);
  renderCart();
};

window.inputQtyLocal = function(productId, value) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  let val = parseInt(value);
  const productInfo = getProductById(productId);

  if (isNaN(val) || val < 1) {
    val = 1;
  } else if (productInfo && val > productInfo.stock) {
    showToast(`Sorry, only ${productInfo.stock} units available in stock.`, "danger");
    val = productInfo.stock;
  }

  item.quantity = val;
  saveCart(cart);
  renderCart();
};

window.removeCartItemLocal = function(productId) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
  showToast(`Removed "${item.name}" from cart.`, "info");
};

/* ==========================================================================
   Promo Code Application
   ========================================================================== */
function setupPromoCode() {
  const applyBtn = document.getElementById("promo-btn");
  const promoInput = document.getElementById("promo-input");
  const feedback = document.getElementById("promo-feedback");

  if (!applyBtn || !promoInput) return;

  applyBtn.addEventListener("click", () => {
    const code = promoInput.value.trim().toUpperCase();

    if (code === "SAVE10") {
      discountRate = 0.10;
      feedback.classList.remove("d-none");
      feedback.textContent = "Promo code applied successfully (10% Off)!";
      feedback.className = "form-text text-success small";
      showToast("Coupon SAVE10 applied! You got 10% discount.", "success");
      calculateSummary();
    } else if (code === "") {
      discountRate = 0.0;
      feedback.classList.add("d-none");
      calculateSummary();
    } else {
      discountRate = 0.0;
      feedback.classList.remove("d-none");
      feedback.textContent = "Invalid promo code.";
      feedback.className = "form-text text-danger small";
      showToast("Invalid Promo Code", "danger");
      calculateSummary();
    }
  });
}

/* ==========================================================================
   Checkout Modal Form Processing
   ========================================================================== */
function setupCheckout() {
  const proceedBtn = document.getElementById("btn-proceed-checkout");
  const form = document.getElementById("checkout-form");
  let modalInstance = null;

  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      // Check if user is checked out or has items
      const cart = getCart();
      if (cart.length === 0) return;

      const modalEl = document.getElementById("checkoutModal");
      modalInstance = new bootstrap.Modal(modalEl);
      modalInstance.show();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Perform validation
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      form.classList.add("was-validated");
      
      // Disable submit button during "processing"
      const submitBtn = document.getElementById("btn-submit-checkout");
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Placing Order...`;

      // Simulate network request
      setTimeout(() => {
        // Clear cart
        localStorage.removeItem("cart");
        updateBadges();

        // Hide Modal
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // Fallback if modal was loaded differently
          const bootstrapModal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
          if (bootstrapModal) bootstrapModal.hide();
        }

        // Show Success Page message or toast
        showToast("Success! Your order has been placed.", "success");
        
        // Render success page details in place of cart
        const container = document.querySelector("#cart-main-row").parentNode;
        container.innerHTML = `
          <div class="text-center py-5 my-5">
            <div class="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success p-3 rounded-circle mb-4" style="width: 80px; height: 80px;">
              <i class="bi bi-bag-check-fill fs-1"></i>
            </div>
            <h2 class="fw-bold mb-2">Order Confirmed!</h2>
            <p class="text-secondary max-width-500 mx-auto">Thank you for your purchase. We have received your order and are preparing it for shipment. A receipt copy was sent to your email.</p>
            <p class="text-secondary small">Redirecting to home page in <span id="countdown">5</span> seconds...</p>
            <a href="index.html" class="btn btn-primary rounded-pill px-4 mt-3">Return Home Now</a>
          </div>
        `;

        // Start countdown
        let count = 5;
        const interval = setInterval(() => {
          count--;
          const cd = document.getElementById("countdown");
          if (cd) cd.textContent = count;
          if (count <= 0) {
            clearInterval(interval);
            window.location.href = "index.html";
          }
        }, 1000);

      }, 2000);

    }, false);
  }
}
