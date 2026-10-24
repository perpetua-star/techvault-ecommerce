const productContainer = document.getElementById("shopProducts");
const productCards = [...document.querySelectorAll(".product-card")];
const productCount = document.getElementById("productCount");
const sortSelect = document.getElementById("sortProducts");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const inStockCheckbox = document.getElementById("inStock");
const noProducts = document.getElementById("noProducts");

const categoryCheckboxes = [
    ...document.querySelectorAll('input[name="category"]')
];

const params = new URLSearchParams(window.location.search);
const initialSearch = params.get("search") || "";
const initialCategory = params.get("category") || "";

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.value = initialSearch;
}

if (initialCategory) {
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = checkbox.value === initialCategory;
    });
}

function applyFilters() {
    const search = (searchInput?.value || "").trim().toLowerCase();
    const selectedCategories = categoryCheckboxes
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const maxPrice = Number(priceRange.value);
    const stockOnly = inStockCheckbox.checked;

    productCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category;
        const price = Number(card.dataset.price);
        const stock = Number(card.dataset.stock);

        const matchesSearch = name.includes(search);
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(category);
        const matchesPrice = price <= maxPrice;
        const matchesStock = !stockOnly || stock > 0;

        card.hidden = !(
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesStock
        );

        const addButton = card.querySelector(".add-to-cart");

        if (addButton) {
            addButton.disabled = stock <= 0;
            addButton.textContent = stock <= 0
                ? "Out of Stock"
                : "Add to Cart";
        }
    });

    const visibleCards = productCards.filter(card => !card.hidden);
    productCount.textContent = visibleCards.length;
    noProducts.hidden = visibleCards.length > 0;

    sortProducts();
}

function sortProducts() {
    const mode = sortSelect.value;

    const visibleCards = productCards.filter(card => !card.hidden);
    const hiddenCards = productCards.filter(card => card.hidden);

    visibleCards.sort((a, b) => {
        const priceA = Number(a.dataset.price);
        const priceB = Number(b.dataset.price);
        const nameA = a.dataset.name.toLowerCase();
        const nameB = b.dataset.name.toLowerCase();

        if (mode === "price-low") return priceA - priceB;
        if (mode === "price-high") return priceB - priceA;
        if (mode === "name") return nameA.localeCompare(nameB);
        return Number(a.dataset.id) - Number(b.dataset.id);
    });

    [...visibleCards, ...hiddenCards].forEach(card => {
        productContainer.appendChild(card);
    });
}

priceRange.addEventListener("input", () => {
    priceValue.textContent = "KSh " +
        Number(priceRange.value).toLocaleString("en-KE");
    applyFilters();
});

categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", applyFilters);
});

inStockCheckbox.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", sortProducts);

document.getElementById("applyFilters")
    .addEventListener("click", applyFilters);

document.getElementById("clearFilters")
    .addEventListener("click", () => {
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        priceRange.value = priceRange.max;
        priceValue.textContent = "KSh " +
            Number(priceRange.max).toLocaleString("en-KE");

        inStockCheckbox.checked = false;
        sortSelect.value = "default";

        if (searchInput) searchInput.value = "";

        applyFilters();
    });

applyFilters();





document.addEventListener("DOMContentLoaded", function () {
    const productCards = document.querySelectorAll(".shop-product");

    productCards.forEach(function (card) {
        const productId = card.dataset.id;

        // Open product details when the product is clicked
        card.addEventListener("click", function (event) {
            // Avoid redirecting when clicking buttons
            if (event.target.closest("button")) {
                return;
            }

            if (productId) {
                window.location.href =
                    "product-details.html?id=" +
                    encodeURIComponent(productId);
            }
        });

        // Make the product card keyboard accessible
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "link");

        card.addEventListener("keydown", function (event) {
            if (
                (event.key === "Enter" || event.key === " ") &&
                !event.target.closest("button")
            ) {
                event.preventDefault();

                if (productId) {
                    window.location.href =
                        "product-details.html?id=" +
                        encodeURIComponent(productId);
                }
            }
        });
    });
});