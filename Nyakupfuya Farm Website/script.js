/* ==========================================================================
   NYAKUPFUYA FARM - UNIVERSAL WEBSITE JAVASCRIPT
   Works across: index.html, shop.html, wholesale.html, harvest_calender.html
   ========================================================================== */

// Helper: Escape user strings to prevent breaking HTML or XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// NYAKUPFUYA FARM SHOPPING CART
let cart = JSON.parse(localStorage.getItem("farmCart")) || [];

const cartApp = {

  addItem(name, price) {
    let existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name: name, price: Number(price), quantity: 1 });
    }
    this.saveCart();
    this.updateCart();
    this.openModal();

    // Trigger cart button bounce animation
    if (typeof window.triggerCartBounce === 'function') {
      window.triggerCartBounce();
    }
  },

  removeItem(index) {
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      this.saveCart();
      this.updateCart();
    }
  },

  changeQuantity(index, amount) {
    if (cart[index]) {
      cart[index].quantity += amount;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      this.saveCart();
      this.updateCart();
    }
  },

  openModal() {
    const modal = document.getElementById("cart-modal");
    if (modal) modal.classList.add("active");
  },

  closeModal() {
    const modal = document.getElementById("cart-modal");
    if (modal) modal.classList.remove("active");
  },

  saveCart() {
    localStorage.setItem("farmCart", JSON.stringify(cart));
  },

  // ENTERPRISE LOGISTICS GATEWAY (WHATSAPP & EMAIL)
 // ENTERPRISE LOGISTICS GATEWAY (WHATSAPP & EMAIL)
  processCheckout(type = 'whatsapp') {
    if (cart.length === 0) {
      alert("Your order basket is currently empty.");
      return;
    }

    let grandTotal = 0;
    let orderDetails = "";

    cart.forEach((item, index) => {
      let lineTotal = item.price * item.quantity;
      grandTotal += lineTotal;
      orderDetails += `${index + 1}. ${item.name}\n   Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${lineTotal.toFixed(2)}\n\n`;
    });

   if (type === 'email') {
  // Prevent page redirection by using AJAX fetch to Formspree
  const formspreeEndpoint = "https://formspree.io/f/mwlerbdk"; // Replace with your active Formspree ID

  const emailBtn = document.getElementById("btn-checkout-email");
  if (emailBtn) emailBtn.innerText = "Sending Order...";

  fetch(formspreeEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      order_type: "Email Order Inquiry",
      items: cart,
      total_amount: `$${grandTotal.toFixed(2)}`,
      order_summary: orderDetails
    })
  })
  .then(response => {
    if (response.ok) {
      alert("Your order has been submitted successfully! We will contact you shortly.");
      cart = [];
      this.saveCart();
      this.updateCart();
      this.closeModal();
    } else {
      alert("There was an issue submitting your order via email. Please try again or use WhatsApp.");
    }
  })
  .catch(error => {
    alert("Network error. Please check your connection or send via WhatsApp.");
  })
  .finally(() => {
    if (emailBtn) emailBtn.innerHTML = '<i class="fa-solid fa-envelope"></i> Order via Email';
  });

    } else {
      // Default: WhatsApp routing
      let phone = "263782798993";
      let message = "*NEW ORDER INQUIRY - ABOUNDING HARVEST*\n";
      message += "=================================\n\n";

      cart.forEach((item, index) => {
        let lineTotal = item.price * item.quantity;
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Qty: ${item.quantity} × $${item.price.toFixed(2)}\n`;
        message += `   Subtotal: $${lineTotal.toFixed(2)}\n\n`;
      });

      message += "=================================\n";
      message += `*ESTIMATED TOTAL ORDER: $${grandTotal.toFixed(2)}*\n\n`;
      message += "_Please reply with your delivery address or collection schedule preference to confirm your formal invoice._";

      let encodedMessage = encodeURIComponent(message);
      let whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;

      window.open(whatsappURL, '_blank');
    }
  },

  updateCart() {
    const container = document.getElementById("cart-items-container");
    const count = document.getElementById("cart-count");
    const total = document.getElementById("cart-total");

    if (!container) return;

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
      container.innerHTML = `<p class="empty-msg">Your basket is currently empty.</p>`;
    } else {
      let itemsHTML = "";

      cart.forEach((item, index) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        itemsHTML += `
          <div class="cart-item">
            <div>
              <h4>${escapeHTML(item.name)}</h4>
              <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
              <button type="button" onclick="cartApp.changeQuantity(${index},-1)" aria-label="Decrease quantity">-</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="cartApp.changeQuantity(${index},1)" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="remove-btn" onclick="cartApp.removeItem(${index})" aria-label="Remove item">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>`;
      });

      container.innerHTML = itemsHTML;
    }

    if (count) count.innerText = totalItems;
    if (total) total.innerText = "$" + totalPrice.toFixed(2);
  }
}
// UNIFIED PAGE INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize cart UI on page load
  cartApp.updateCart();

  // 2. Mobile Navigation Toggle & Icon Switch
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');

      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  // 3. Active Link Highlight based on current URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-list a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 4. Header Live Search & Search Query URL Auto-Filter
  const searchInput = document.querySelector('.search-form input');
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('query');
  const categoryParam = urlParams.get('cat');

  // Pre-fill input if redirecting from another page with ?query=
  if (searchInput && searchParam) {
    searchInput.value = searchParam;
  }

  const applyFilters = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : (searchParam ? searchParam.toLowerCase().trim() : '');
    const products = document.querySelectorAll('.product-card');

    if (products.length === 0) return;

    products.forEach(card => {
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const category = card.querySelector('.category') ? card.querySelector('.category').textContent.toLowerCase() : '';
      const dataCategory = card.getAttribute('data-category') ? card.getAttribute('data-category').toLowerCase() : '';

      const matchesQuery = !query || title.includes(query) || category.includes(query);
      const matchesCatParam = !categoryParam || category.includes(categoryParam) || dataCategory.includes(categoryParam);

      if (matchesQuery && matchesCatParam) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Run on page load if query/category parameter exists
  if (searchParam || categoryParam) {
    applyFilters();
  }

  // Listen for live input typing
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // 5. Cart Bounce Animation Handler
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => cartApp.openModal());

    window.triggerCartBounce = function () {
      cartBtn.classList.add('bounce');
      setTimeout(() => {
        cartBtn.classList.remove('bounce');
      }, 400);
    };
  }

  // 6. Cart Modal Event Listeners
  const closeCartBtn = document.getElementById('close-cart');
  const cartModal = document.getElementById('cart-modal');

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => cartApp.closeModal());
  }
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target.id === 'cart-modal') {
        cartApp.closeModal();
      }
    });
  }

  // Close Cart Modal on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cartApp.closeModal();
    }
  });

  // 7. Category Filter Buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.catalog-grid .product-card, .product-grid .product-card');
  
  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filterValue = button.getAttribute('data-filter');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 8. Dynamic Scroll Button Logic (Top/Bottom)
  const scrollBtn = document.getElementById('scrollBtn');
  if (scrollBtn) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = docHeight - windowHeight - currentScrollY;

      if (currentScrollY < 200 || distanceFromBottom < 50) {
        scrollBtn.style.display = 'none';
        return;
      } else {
        scrollBtn.style.display = 'flex';
      }

      if (currentScrollY > lastScrollY) {
        scrollBtn.innerHTML = '↓';
        scrollBtn.setAttribute('data-direction', 'down');
      } else {
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('data-direction', 'up');
      }
      lastScrollY = currentScrollY;
    });

    scrollBtn.addEventListener('click', () => {
      const direction = scrollBtn.getAttribute('data-direction');
      if (direction === 'down') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
});
