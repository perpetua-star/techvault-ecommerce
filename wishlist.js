document.addEventListener("DOMContentLoaded", function () {
    const wishlistKey = "techVaultWishlist";
    const cartKey = "techVaultCart";

    const wishlistItems = document.getElementById("wishlistItems");
    const emptyWishlist = document.getElementById("emptyWishlist");
    const wishlistMessage = document.getElementById("wishlistMessage");
    const cartCount = document.getElementById("cartCount");

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

    function readStorage(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function saveStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function formatPrice(price) {
        return "KSh " + Number(price).toLocaleString("en-KE");
    }

    function updateCartCount() {
        if (!cartCount) return;

        const cart = readStorage(cartKey);
        const total = cart.reduce(function (sum, item) {
            return sum + Math.max(0, Number(item.quantity) || 0);
        }, 0);

        cartCount.textContent = total;
    }

    function showMessage(message) {
        if (wishlistMessage) {
            wishlistMessage.textContent = message;
        }
    }

    function renderWishlist() {
        if (!wishlistItems || !emptyWishlist) return;

        const wishlist = readStorage(wishlistKey);
        wishlistItems.replaceChildren();

        if (wishlist.length === 0) {
            emptyWishlist.hidden = false;
            return;
        }

        emptyWishlist.hidden = true;

        wishlist.forEach(function (item) {
            const id = Number(item.id);
            const product = products[id];

            if (!product) return;

            const card = document.createElement("article");
            card.className = "wishlist-card";

            const image = document.createElement("div");
            image.className = "wishlist-product-image";
            image.textContent = product.emoji;
            image.setAttribute("aria-hidden", "true");

            const name = document.createElement("h2");
            name.textContent = product.name;

            const price = document.createElement("p");
            price.className = "wishlist-price";
            price.textContent = formatPrice(product.price);

            const actions = document.createElement("div");
            actions.className = "wishlist-actions";

            const viewButton = document.createElement("a");
            viewButton.className = "btn btn-primary";
            viewButton.href = "product-details.html?id=" + id;
            viewButton.textContent = "View Product";

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "btn btn-secondary";
            removeButton.textContent = "Remove";

            removeButton.addEventListener("click", function () {
                const updatedWishlist = readStorage(wishlistKey).filter(
                    savedItem => Number(savedItem.id) !== id
                );

                saveStorage(wishlistKey, updatedWishlist);
                showMessage("Product removed from your wishlist.");
                renderWishlist();
            });

            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.className = "btn btn-primary";
            addButton.textContent = "Add to Cart";
            addButton.disabled = product.stock < 1;

            if (product.stock < 1) {
                addButton.textContent = "Out of Stock";
            }

            addButton.addEventListener("click", function () {
                if (product.stock < 1) {
                    showMessage("This product is currently out of stock.");
                    return;
                }

                const cart = readStorage(cartKey);
                const existing = cart.find(
                    cartItem => Number(cartItem.id) === id
                );

                if (existing) {
                    if ((Number(existing.quantity) || 0) >= product.stock) {
                        showMessage("Maximum available stock is already in your cart.");
                        return;
                    }

                    existing.quantity = (Number(existing.quantity) || 0) + 1;
                } else {
                    cart.push({
                        id: id,
                        name: product.name,
                        price: product.price,
                        quantity: 1
                    });
                }

                saveStorage(cartKey, cart);
                updateCartCount();
                showMessage("Product added to your cart.");
            });

            actions.append(viewButton, addButton, removeButton);
            card.append(image, name, price, actions);
            wishlistItems.appendChild(card);
        });

        if (wishlistItems.children.length === 0) {
            emptyWishlist.hidden = false;
        }
    }

    updateCartCount();
    renderWishlist();
});