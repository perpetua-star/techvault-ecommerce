document.addEventListener("DOMContentLoaded", function () {
    const CART_KEY = "techVaultCart";
    const ORDERS_KEY = "techVaultOrders";
    const FREE_DELIVERY_LIMIT = 5000;
    const DELIVERY_FEE = 250;

    const form = document.getElementById("checkoutForm");
    const checkoutItems = document.getElementById("checkoutItems");
    const subtotalElement = document.getElementById("checkoutSubtotal");
    const deliveryElement = document.getElementById("checkoutDelivery");
    const totalElement = document.getElementById("checkoutTotal");
    const cartCountElement = document.getElementById("cartCount");
    const messageElement = document.getElementById("checkoutMessage");
    const placeOrderButton = document.getElementById("placeOrderButton");

    const products = {
        1: { name: "Samsung Galaxy Smartphone", price: 45000, stock: 12 },
        2: { name: "HP Pavilion Laptop", price: 75000, stock: 8 },
        3: { name: "Wireless Headphones", price: 8500, stock: 20 },
        4: { name: "Smartwatch", price: 6500, stock: 15 },
        5: { name: "Samsung 4K Smart TV", price: 109999, stock: 5 },
        6: { name: "Gaming Console", price: 64999, stock: 6 },
        7: { name: "Canon Digital Camera", price: 80999, stock: 0 },
        8: { name: "Wireless Earbuds", price: 3499, stock: 25 }
    };

    function readArray(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function formatPrice(amount) {
        return "KSh " + Number(amount).toLocaleString("en-KE");
    }

    function getValidCart() {
        return readArray(CART_KEY).filter(function (item) {
            const product = products[Number(item.id)];
            const quantity = Number(item.quantity);

            return product &&
                Number.isInteger(quantity) &&
                quantity > 0 &&
                quantity <= product.stock;
        });
    }

    function calculateTotals(cart) {
        const subtotal = cart.reduce(function (sum, item) {
            const product = products[Number(item.id)];
            return sum + product.price * Number(item.quantity);
        }, 0);

        const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_LIMIT
            ? 0
            : DELIVERY_FEE;

        return {
            subtotal: subtotal,
            delivery: delivery,
            total: subtotal + delivery
        };
    }

    function renderCheckout() {
        const cart = getValidCart();
        checkoutItems.replaceChildren();

        cart.forEach(function (item) {
            const product = products[Number(item.id)];

            const row = document.createElement("div");
            row.className = "checkout-item";

            const name = document.createElement("span");
            name.className = "checkout-item-name";
            name.textContent =
                product.name + " × " + Number(item.quantity);

            const price = document.createElement("span");
            price.className = "checkout-item-price";
            price.textContent = formatPrice(
                product.price * Number(item.quantity)
            );

            row.append(name, price);
            checkoutItems.appendChild(row);
        });

        const totals = calculateTotals(cart);

        subtotalElement.textContent = formatPrice(totals.subtotal);
        deliveryElement.textContent = formatPrice(totals.delivery);
        totalElement.textContent = formatPrice(totals.total);

        if (cartCountElement) {
            const count = cart.reduce(function (sum, item) {
                return sum + Number(item.quantity);
            }, 0);

            cartCountElement.textContent = count;
        }

        placeOrderButton.disabled = cart.length === 0;

        if (cart.length === 0) {
            messageElement.textContent =
                "Your cart is empty or contains invalid items. Please return to the shop.";
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        messageElement.textContent = "";

        const cart = getValidCart();

        if (cart.length === 0) {
            messageElement.textContent =
                "Your cart is empty. Add a product before placing an order.";
            renderCheckout();
            return;
        }

        if (!form.reportValidity()) {
            return;
        }

        const paymentInput = form.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        if (!paymentInput) {
            messageElement.textContent = "Please select a payment method.";
            return;
        }

        const totals = calculateTotals(cart);

        const order = {
            orderNumber: "TV" + Date.now(),
            date: new Date().toISOString(),
            customer: {
                fullName: document.getElementById("fullName").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                county: document.getElementById("county").value.trim(),
                town: document.getElementById("town").value.trim(),
                address: document.getElementById("address").value.trim()
            },
            paymentMethod: paymentInput.value,
            items: cart.map(function (item) {
                const product = products[Number(item.id)];

                return {
                    id: Number(item.id),
                    name: product.name,
                    price: product.price,
                    quantity: Number(item.quantity)
                };
            }),
            subtotal: totals.subtotal,
            delivery: totals.delivery,
            total: totals.total,
            status: "Pending"
        };

        const orders = readArray(ORDERS_KEY);
        orders.push(order);

        try {
            localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
            localStorage.setItem(CART_KEY, "[]");
            localStorage.setItem("techVaultLastOrder", JSON.stringify(order));

            window.location.href = "order-confirmation.html";
        } catch (error) {
            messageElement.textContent =
                "Unable to save your order in this browser. Please try again.";
        }
    });

    renderCheckout();
});