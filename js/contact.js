// Contact Form Validation Script

document.addEventListener("DOMContentLoaded", () => {
  setupContactForm();
});

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit-btn");

  if (!form || !submitBtn) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Check validity
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    form.classList.add("was-validated");

    // Disable button to prevent double-submit and show spinner
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;

    // Simulate network submission delay
    setTimeout(() => {
      // Show success toast
      showToast("Thank you! Your message was sent successfully.", "success");

      // Reset form
      form.reset();
      form.classList.remove("was-validated");

      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1500);

  }, false);
}
