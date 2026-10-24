document.addEventListener("DOMContentLoaded", function () {
    const products = {
        1: {
            id: 1,
            name: "Samsung Galaxy Smartphone",
            category: "Smartphones",
            price: 45000,
            emoji: "📱",
            stock: 12,
            description: "A modern smartphone designed for everyday communication, entertainment and productivity."
        },
        2: {
            id: 2,
            name: "HP Pavilion Laptop",
            category: "Laptops",
            price: 75000,
            emoji: "💻",
            stock: 8,
            description: "A versatile laptop for studying, working and everyday computing."
        },
        3: {
            id: 3,
            name: "Wireless Headphones",
            category: "Audio",
            price: 8500,
            emoji: "🎧",
            stock: 20,
            description: "Enjoy your favourite music with convenient wireless listening."
        },
        4: {
            id: 4,
            name: "Smartwatch",
            category: "Wearables",
            price: 6500,
            emoji: "⌚",
            stock: 15,
            description: "A smart wearable for checking notifications and tracking daily activity."
        },
        5: {
            id: 5,
            name: "Samsung 4K Smart TV",
            category: "TV & Home",
            price: 109999,
            emoji: "📺",
            stock: 5,
            description: "A 4K smart television for home entertainment."
        },
        6: {
            id: 6,
            name: "Gaming Console",
            category: "Gaming",
            price: 64999,
            emoji: "🎮",
            stock: 6,
            description: "A gaming console for immersive entertainment."
        },
        7: {
            id: 7,
            name: "Canon Digital Camera",
            category: "Cameras",
            price: 80999,
            emoji: "📷",
            stock: 0,
            description: "A digital camera for capturing photos and videos."
        },
        8: {
            id: 8,
            name: "Wireless Earbuds",
            category: "Audio",
            price: 3499,
            emoji: "🎵",
            stock: 25,
            description: "Compact wireless earbuds for listening on the go."
        }
    };

    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));
    const product = products[productId];

    const getElement = (id) => document.getElementById(id);

    const cartKey = "techVaultCart";
    const wishlistKey = "techVaultWishlist";

    function readStorage(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function saveStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function updateCartCount() {
        const countElement = getElement("cartCount");
        if (!countElement) return;

        const cart = readStorage(cartKey);
        const totalItems = cart.reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0
        );

        countElement.textContent = totalItems;
    }

    function showMessage(message) {
        const messageElement = getElement("detailsMessage");
        if (messageElement) {
            messageElement.textContent = message;
        }
    }

    function formatPrice(price) {
        return "KSh " + Number(price).toLocaleString("en-KE");
    }

    if (!product) {
        const details = document.querySelector(".product-info");

        if (details) {
            details.innerHTML =
                "<h1>Product not found</h1>" +
                "<p>Please return to the shop and select a valid product.</p>" +
                '<p><a href="shop.html">Back to Shop</a></p>';
        }

        updateCartCount();
        return;
    }

    const setText = (id, value) => {
        const element = getElement(id);
        if (element) element.textContent = value;
    };

    setText("breadcrumbName", product.name);
    setText("productEmoji", product.emoji);
    setText("productCategory", product.category);
    setText("productName", product.name);
    setText("productRating", "★★★★☆");
    setText("productPrice", formatPrice(product.price));
    setText("productDescription", product.description);

    const stockElement = getElement("stockStatus");
    if (stockElement) {
        stockElement.textContent =
            product.stock > 0
                ? "In Stock (" + product.stock + " available)"
                : "Out of Stock";

        stockElement.style.color =
            product.stock > 0 ? "#15803d" : "#dc2626";
    }

    const quantityInput = getElement("quantity");

    if (quantityInput) {
        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.max = Math.max(product.stock, 1);
    }

    const decreaseButton = getElement("decreaseQty");
    const increaseButton = getElement("increaseQty");

    if (decreaseButton && quantityInput) {
        decreaseButton.addEventListener("click", function () {
            const current = Number(quantityInput.value) || 1;
            quantityInput.value = Math.max(1, current - 1);
        });
    }

    if (increaseButton && quantityInput) {
        increaseButton.addEventListener("click", function () {
            const current = Number(quantityInput.value) || 1;

            if (current < product.stock) {
                quantityInput.value = current + 1;
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener("change", function () {
            let quantity = parseInt(quantityInput.value, 10);

            if (!Number.isFinite(quantity)) quantity = 1;

            quantity = Math.max(1, Math.min(quantity, Math.max(product.stock, 1)));
            quantityInput.value = quantity;
        });
    }

    const addToCartButton = getElement("detailsAddToCart");

    if (addToCartButton) {
        addToCartButton.disabled = product.stock < 1;

        if (product.stock < 1) {
            addToCartButton.textContent = "Out of Stock";
        }

        addToCartButton.addEventListener("click", function () {
            if (product.stock < 1) {
                showMessage("Sorry, this product is out of stock.");
                return;
            }

            const quantity = quantityInput
                ? parseInt(quantityInput.value, 10) || 1
                : 1;

            if (quantity > product.stock || quantity < 1) {
                showMessage("Please select a valid quantity.");
                return;
            }

            const cart = readStorage(cartKey);
            const existingItem = cart.find(
                item => Number(item.id) === product.id
            );

            if (existingItem) {
                if ((Number(existingItem.quantity) || 0) + quantity > product.stock) {
                    showMessage("You cannot add more than the available stock.");
                    return;
                }

                existingItem.quantity =
                    (Number(existingItem.quantity) || 0) + quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                });
            }

            saveStorage(cartKey, cart);
            updateCartCount();
            showMessage("Product added to your cart successfully.");
        });
    }

    const wishlistButton = getElement("detailsWishlist");

    if (wishlistButton) {
        wishlistButton.addEventListener("click", function () {
            const wishlist = readStorage(wishlistKey);
            const alreadySaved = wishlist.some(
                item => Number(item.id) === product.id
            );

            if (alreadySaved) {
                showMessage("This product is already in your wishlist.");
                return;
            }

            wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price
            });

            saveStorage(wishlistKey, wishlist);
            showMessage("Product added to your wishlist.");
        });
    }

    const specifications = getElement("specificationTable");

    if (specifications) {
        specifications.innerHTML =
            "<tr><th>Product</th><td>" + product.name + "</td></tr>" +
            "<tr><th>Category</th><td>" + product.category + "</td></tr>" +
            "<tr><th>Price</th><td>" + formatPrice(product.price) + "</td></tr>" +
            "<tr><th>Availability</th><td>" +
            (product.stock > 0 ? "Available" : "Out of stock") +
            "</td></tr>";
    }

    updateCartCount();
});