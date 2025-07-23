// script.js

$(document).ready(function() {

  // --- Slick Carousel Initialization ---
  $('.shoe-carousel').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  });

  // --- Mobile Menu Toggle Functionality ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavLinks = document.getElementById('mobile-nav-links');

  if (mobileMenuToggle && mobileNavLinks) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileNavLinks.classList.toggle('active');
    });

    const navLinks = mobileNavLinks.querySelectorAll('.nav-titles');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileNavLinks.classList.remove('active');
        mobileMenuToggle.focus();
      });
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        mobileNavLinks.classList.remove('active');
      }
    });
  }

  // --- Smooth Scrolling for Navigation Links ---
  document.querySelectorAll('.nav-desktop .nav-titles, .nav-mobile .nav-titles').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Shopping Cart Functionality ---
  let cart = []; // Initialize empty cart array

  // Function to update cart display
  function updateCartDisplay() {
      const desktopCartCount = document.getElementById('desktop-cart-count');
      const mobileCartCount = document.getElementById('mobile-cart-count');
      const desktopCartItemsList = document.getElementById('desktop-cart-items');
      const desktopCartTotalSpan = document.getElementById('desktop-cart-total');
      // const emptyCartMessage = desktopCartItemsList.querySelector('.empty-cart-message'); // This line is not needed here after refactoring

      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

      if (desktopCartCount) desktopCartCount.textContent = totalItems;
      if (mobileCartCount) mobileCartCount.textContent = totalItems;
      if (desktopCartTotalSpan) desktopCartTotalSpan.textContent = totalPrice;

      // Update mini-cart item list
      if (desktopCartItemsList) {
          desktopCartItemsList.innerHTML = ''; // Clear existing items

          if (cart.length === 0) {
              const emptyMessage = document.createElement('li');
              emptyMessage.className = 'empty-cart-message';
              emptyMessage.textContent = 'Cart is empty';
              desktopCartItemsList.appendChild(emptyMessage);
          } else {
              cart.forEach(item => {
                  const listItem = document.createElement('li');
                  listItem.innerHTML = `
                      <span class="item-name">${item.name} (x${item.quantity})</span>
                      <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                  `;
                  desktopCartItemsList.appendChild(listItem);
              });
          }
      }
  }

  // Add item to cart
  function addToCart(product) {
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
          existingItem.quantity++;
      } else {
          cart.push({ ...product, quantity: 1 });
      }
      updateCartDisplay();
      showAddToCartFeedback(product.name);
  }

  // Show "Added to Cart!" feedback
  function showAddToCartFeedback(productName) {
      const feedbackMessage = `${productName} added to cart!`;
      console.log(feedbackMessage);
  }

  // Event listener for "Add to Cart" buttons
  document.querySelectorAll('.buy-btn, .add-to-cart-modal-btn').forEach(button => {
    button.addEventListener('click', function() {
      let productData;
      if (this.classList.contains('add-to-cart-modal-btn')) {
          productData = {
              id: this.dataset.productId,
              name: document.getElementById('modal-product-name').textContent,
              price: parseFloat(document.getElementById('modal-product-price').textContent.replace('$', '')),
              image: document.getElementById('modal-product-image').src
          };
      } else {
          const card = this.closest('.card');
          productData = {
              id: card.dataset.productId,
              name: card.dataset.name,
              price: parseFloat(card.dataset.price),
              image: card.dataset.image
          };
      }
      addToCart(productData);

      const originalText = this.textContent;
      this.textContent = 'Added!';
      this.style.backgroundColor = '#28a745';
      this.disabled = true;

      setTimeout(() => {
        this.textContent = originalText;
        this.style.backgroundColor = '#3ddc97';
        this.disabled = false;
      }, 1500);

      if (this.classList.contains('add-to-cart-modal-btn')) {
          closeQuickViewModal();
      }
    });
  });

  // --- Mini-Cart Preview Toggle ---
  const desktopCartIconContainer = document.querySelector('.cart-icon-container');
  const desktopMiniCartPreview = document.getElementById('desktop-mini-cart-preview');

  if (desktopCartIconContainer && desktopMiniCartPreview) {
      desktopCartIconContainer.addEventListener('click', function(event) {
          event.stopPropagation();
          desktopMiniCartPreview.classList.toggle('active');
          updateCartDisplay();
      });

      document.addEventListener('click', function(event) {
          if (!desktopMiniCartPreview.contains(event.target) && !desktopCartIconContainer.contains(event.target)) {
              desktopMiniCartPreview.classList.remove('active');
          }
      });
  }

  // --- Quick View Modal Functionality ---
  const quickViewModal = document.getElementById('quick-view-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalProductImage = document.getElementById('modal-product-image');
  const modalProductName = document.getElementById('modal-product-name');
  const modalProductPrice = document.getElementById('modal-product-price');
  const addToCartModalBtn = document.querySelector('.add-to-cart-modal-btn');

  document.querySelectorAll('.quick-view-btn').forEach(button => {
      button.addEventListener('click', function() {
          const card = this.closest('.card');
          const productId = card.dataset.productId;
          const productName = card.dataset.name;
          const productPrice = card.dataset.price;
          const productImage = card.dataset.image;

          modalProductImage.src = productImage;
          modalProductImage.alt = productName;
          modalProductName.textContent = productName;
          modalProductPrice.textContent = `$${parseFloat(productPrice).toFixed(2)}`;
          addToCartModalBtn.dataset.productId = productId;

          quickViewModal.classList.add('active');
          document.body.style.overflow = 'hidden';
      });
  });

  if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeQuickViewModal);
  }

  if (quickViewModal) {
      quickViewModal.addEventListener('click', function(event) {
          if (event.target === quickViewModal) {
              closeQuickViewModal();
          }
      });
  }

  document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && quickViewModal.classList.contains('active')) {
          closeQuickViewModal();
      }
  });

  function closeQuickViewModal() {
      quickViewModal.classList.remove('active');
      document.body.style.overflow = '';
  }

  // --- Scroll to Top Button Functionality ---
  const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

  if (scrollToTopBtn) {
      window.addEventListener('scroll', function() {
          if (window.scrollY > 300) {
              scrollToTopBtn.style.display = 'block';
          } else {
              scrollToTopBtn.style.display = 'none';
          }
      });

      scrollToTopBtn.addEventListener('click', function() {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }

  // Initial cart display update
  updateCartDisplay();
});