const CART_KEY = "techVaultCart";
const WISHLIST_KEY = "techVaultWishlist";

function readStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function updateCartCount() {
    const cart = readStorage(CART_KEY);
    const count = cart.reduce(
        (total, item) => total + Number(item.quantity || 0), 0
    );

    document.querySelectorAll("#cartCount").forEach(element => {
        element.textContent = count;
    });
}

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const cart = readStorage(CART_KEY);
        const id = button.dataset.id;
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id,
                name: button.dataset.name,
                price: Number(button.dataset.price),
                quantity: 1
            });
        }

        saveStorage(CART_KEY, cart);
        updateCartCount();

        const originalText = button.textContent;
        button.textContent = "Added to Cart ✓";
        setTimeout(() => {
            button.textContent = originalText;
        }, 1200);
    });
});

function updateWishlistButtons() {
    const wishlist = readStorage(WISHLIST_KEY);

    document.querySelectorAll(".wishlist-btn").forEach(button => {
        const saved = wishlist.some(item => item.id === button.dataset.id);
        button.classList.toggle("saved", saved);
        button.textContent = saved ? "♥" : "♡";
        button.setAttribute(
            "aria-pressed",
            saved ? "true" : "false"
        );
    });
}

document.querySelectorAll(".wishlist-btn").forEach(button => {
    button.addEventListener("click", () => {
        let wishlist = readStorage(WISHLIST_KEY);
        const id = button.dataset.id;

        if (wishlist.some(item => item.id === id)) {
            wishlist = wishlist.filter(item => item.id !== id);
        } else {
            const product = button.closest(".product-card");

            wishlist.push({
                id,
                name: product.querySelector("h3").textContent,
                price: Number(
                    product.querySelector(".price").textContent
                        .replace(/[^\d.]/g, "")
                )
            });
        }

        saveStorage(WISHLIST_KEY, wishlist);
        updateWishlistButtons();
    });
});

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

if (searchForm && searchInput) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (query) {
            window.location.href =
                "shop.html?search=" + encodeURIComponent(query);
        }
    });
}

updateCartCount();
updateWishlistButtons();



const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        contactFeedback.textContent =
            "Thank you! Your message has been entered, but it has not been sent yet.";

        contactForm.reset();
    });
}