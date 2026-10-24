document.addEventListener("DOMContentLoaded", function () {
    const CART_KEY = "techVaultCart";
    const FREE_DELIVERY_LIMIT = 5000;
    const DELIVERY_FEE = 250;

    const cartItemsElement = document.getElementById("cartItems");
    const emptyCartElement = document.getElementById("emptyCart");
    const cartCountElement = document.getElementById("cartCount");
    const cartSubtotalElement = document.getElementById("cartSubtotal");
    const cartDeliveryElement = document.getElementById("cartDelivery");
    const cartTotalElement = document.getElementById("cartTotal");
    const deliveryNoteElement = document.getElementById("deliveryNote");
    const checkoutButton = document.getElementById("checkoutButton");
    const cartMessageElement = document.getElementById("cartMessage");

    const products = {
        1: { name: "Samsung Galaxy Smartphone", price: 45000, emoji: "📱", stock: 12 },
        2: { name: "HP Pavilion Laptop", price: 75000, emoji: "💻", stock: 8 },
        3: { name: "Wireless Headphones", price: 8500, emoji: "🎧", stock: 20 },
        4: { name: "Smartwatch", price: 6500, emoji: "⌚", stock: 15 },
        5: { name: "Samsung 4K Smart TV", price: 109999, emoji: "📺", stock: 5 },
        6: { name: "Gaming Console", price: 64999, emoji: "🎮", stock: 6 },
        7: { name: "Canon Digital Camera", price: 80999, emoji: "📷", stock: 0 },
        8: { name: "Wireless Earbuds", price: 3499, emoji: "🎵", stock: 25 }
    };

    function readCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function formatPrice(amount) {
        return "KSh " + Number(amount).toLocaleString("en-KE");
    }

    function showMessage(message) {
        if (cartMessageElement) {
            cartMessageElement.textContent = message;
        }
    }

    function updateCartCount(cart) {
        if (!cartCountElement) return;

        const count = cart.reduce(function (sum, item) {
            return sum + Math.max(0, Number(item.quantity) || 0);
        }, 0);

        cartCountElement.textContent = count;
    }

    function renderCart() {
        const cart = readCart();

        cartItemsElement.replaceChildren();

        let subtotal = 0;
        let validItems = 0;

        cart.forEach(function (item) {
            const id = Number(item.id);
            const product = products[id];
            const quantity = Math.floor(Number(item.quantity));

            if (!product || !Number.isFinite(quantity) || quantity < 1) {
                return;
            }

            validItems++;
            subtotal += product.price * quantity;

            const row = document.createElement("article");
            row.className = "cart-item";

            const image = document.createElement("div");
            image.className = "cart-item-image";
            image.textContent = product.emoji;
            image.setAttribute("aria-hidden", "true");

            const info = document.createElement("div");
            info.className = "cart-item-info";

            const name = document.createElement("h3");
            name.textContent = product.name;

            const price = document.createElement("p");
            price.className = "cart-item-price";
            price.textContent = formatPrice(product.price);

            const controls = document.createElement("div");
            controls.className = "cart-item-controls";

            const decrease = document.createElement("button");
            decrease.type = "button";
            decrease.className = "quantity-button";
            decrease.textContent = "−";
            decrease.setAttribute("aria-label", "Decrease quantity");

            const quantityText = document.createElement("span");
            quantityText.className = "quantity-value";
            quantityText.textContent = quantity;

            const increase = document.createElement("button");
            increase.type = "button";
            increase.className = "quantity-button";
            increase.textContent = "+";
            increase.setAttribute("aria-label", "Increase quantity");
            increase.disabled = quantity >= product.stock || product.stock < 1;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-button";
            remove.textContent = "Remove";

            decrease.disabled = quantity <= 1;

            decrease.addEventListener("click", function () {
                changeQuantity(id, -1);
            });

            increase.addEventListener("click", function () {
                changeQuantity(id, 1);
            });

            remove.addEventListener("click", function () {
                saveCart(readCart().filter(
                    cartItem => Number(cartItem.id) !== id
                ));
                showMessage("Product removed from your cart.");
                renderCart();
            });

            controls.append(decrease, quantityText, increase, remove);
            info.append(name, price, controls);

            const lineTotal = document.createElement("div");
            lineTotal.className = "cart-item-total";
            lineTotal.textContent = formatPrice(product.price * quantity);

            row.append(image, info, lineTotal);
            cartItemsElement.appendChild(row);
        });

        const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_LIMIT
            ? 0
            : DELIVERY_FEE;

        const total = subtotal + delivery;

        cartSubtotalElement.textContent = formatPrice(subtotal);
        cartDeliveryElement.textContent = formatPrice(delivery);
        cartTotalElement.textContent = formatPrice(total);

        deliveryNoteElement.textContent =
            subtotal === 0
                ? "Add products to calculate delivery."
                : subtotal >= FREE_DELIVERY_LIMIT
                    ? "Your order qualifies for free delivery!"
                    : "Spend " + formatPrice(FREE_DELIVERY_LIMIT - subtotal) +
                      " more to get free delivery.";

        emptyCartElement.hidden = validItems > 0;
        checkoutButton.disabled = validItems === 0;

        updateCartCount(cart);
    }

    function changeQuantity(id, change) {
        const cart = readCart();
        const item = cart.find(cartItem => Number(cartItem.id) === id);
        const product = products[id];

        if (!item || !product) return;

        const newQuantity = Math.floor(Number(item.quantity) || 1) + change;

        if (newQuantity < 1) return;

        if (newQuantity > product.stock) {
            showMessage("You have reached the available stock limit.");
            return;
        }

        item.quantity = newQuantity;
        saveCart(cart);
        showMessage("");
        renderCart();
    }

    checkoutButton.addEventListener("click", function () {
        if (readCart().length > 0) {
            window.location.href = "checkout.html";
        }
    });

    renderCart();
});