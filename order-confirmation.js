document.addEventListener("DOMContentLoaded", function () {
    const orderDetails = document.getElementById("orderDetails");
    const noOrder = document.getElementById("noOrder");

    const order = JSON.parse(
        localStorage.getItem("techVaultLastOrder") || "null"
    );

    const money = amount =>
        "KSh " + Number(amount || 0).toLocaleString("en-KE");

    const cartCount = document.getElementById("cartCount");
    const cart = JSON.parse(
        localStorage.getItem("techVaultCart") || "[]"
    );

    if (cartCount) {
        cartCount.textContent = cart.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );
    }

    document.getElementById("printOrder").addEventListener("click", function () {
        window.print();
    });

    if (!order) {
        orderDetails.hidden = true;
        noOrder.hidden = false;
        document.getElementById("confirmationMessage").textContent =
            "No saved order was found on this browser.";
        return;
    }

    orderDetails.hidden = false;
    noOrder.hidden = true;

    document.getElementById("orderNumber").textContent =
        order.orderNumber || "Not available";

    document.getElementById("customerName").textContent =
        order.customer?.name || "Not provided";

    document.getElementById("customerEmail").textContent =
        order.customer?.email || "Not provided";

    document.getElementById("customerPhone").textContent =
        order.customer?.phone || "Not provided";

    document.getElementById("customerAddress").textContent = [
        order.customer?.address,
        order.customer?.town,
        order.customer?.county
    ].filter(Boolean).join(", ") || "Not provided";

    document.getElementById("paymentMethod").textContent =
        order.paymentMethod || "Not specified";

    document.getElementById("orderStatus").textContent =
        order.status || "Pending";

    document.getElementById("confirmedSubtotal").textContent =
        money(order.subtotal);

    document.getElementById("confirmedDelivery").textContent =
        Number(order.delivery || 0) === 0
            ? "FREE"
            : money(order.delivery);

    document.getElementById("confirmedTotal").textContent =
        money(order.total);

    const itemsContainer = document.getElementById("confirmedItems");
    itemsContainer.replaceChildren();

    if (Array.isArray(order.items) && order.items.length > 0) {
        order.items.forEach(item => {
            const row = document.createElement("div");
            row.className = "confirmed-item";

            const details = document.createElement("div");

            const name = document.createElement("div");
            name.className = "confirmed-item-name";
            name.textContent = item.name || "Product";

            const quantity = document.createElement("small");
            quantity.textContent =
                "Quantity: " + Number(item.quantity || 1);

            details.append(name, quantity);

            const price = document.createElement("div");
            price.className = "confirmed-item-total";
            price.textContent = money(
                Number(item.price || 0) * Number(item.quantity || 1)
            );

            row.append(details, price);
            itemsContainer.appendChild(row);
        });
    } else {
        itemsContainer.textContent = "No item details were saved.";
    }

    const disclaimer = document.getElementById("paymentDisclaimer");

    if (/cash on delivery/i.test(order.paymentMethod || "")) {
        disclaimer.textContent =
            "Payment is due when your order is delivered.";
    } else {
        disclaimer.textContent =
            "This is a demonstration order. No real payment has been processed.";
    }

    document.getElementById("confirmationMessage").textContent =
        "Your order details have been loaded successfully.";
});