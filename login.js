document.addEventListener("DOMContentLoaded", function () {
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const loginMessage = document.getElementById("loginMessage");
    const registerMessage = document.getElementById("registerMessage");

    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = "form-message " + type;
    }

    function switchTab(showRegister) {
        loginForm.hidden = showRegister;
        registerForm.hidden = !showRegister;

        loginTab.classList.toggle("active", !showRegister);
        registerTab.classList.toggle("active", showRegister);

        loginMessage.textContent = "";
        registerMessage.textContent = "";
    }

    loginTab.addEventListener("click", function () {
        switchTab(false);
    });

    registerTab.addEventListener("click", function () {
        switchTab(true);
    });

    function getAccounts() {
        try {
            return JSON.parse(
                localStorage.getItem("techVaultDemoAccounts") || "[]"
            );
        } catch {
            return [];
        }
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value
            .trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showMessage(
                registerMessage,
                "The passwords do not match.",
                "error"
            );
            return;
        }

        const accounts = getAccounts();

        if (accounts.some(account => account.email === email)) {
            showMessage(
                registerMessage,
                "An account with this email already exists.",
                "error"
            );
            return;
        }

        accounts.push({ name, email, password });

        localStorage.setItem(
            "techVaultDemoAccounts",
            JSON.stringify(accounts)
        );

        registerForm.reset();

        document.getElementById("loginEmail").value = email;

        switchTab(false);

        showMessage(
            loginMessage,
            "Demo account created. You can now sign in.",
            "success"
        );
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value
            .trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const account = getAccounts().find(
            item => item.email === email && item.password === password
        );

        if (!account) {
            showMessage(
                loginMessage,
                "Account not found or password incorrect. Register first if needed.",
                "error"
            );
            return;
        }

        sessionStorage.setItem(
            "techVaultCurrentUser",
            JSON.stringify({
                name: account.name,
                email: account.email
            })
        );

        showMessage(
            loginMessage,
            "Welcome back, " + account.name + "! Demo sign-in successful.",
            "success"
        );
    });

    const cartCount = document.getElementById("cartCount");

    try {
        const cart = JSON.parse(
            localStorage.getItem("techVaultCart") || "[]"
        );

        if (cartCount) {
            cartCount.textContent = cart.reduce(
                (sum, item) => sum + Number(item.quantity || 0),
                0
            );
        }
    } catch {
        if (cartCount) {
            cartCount.textContent = "0";
        }
    }
});