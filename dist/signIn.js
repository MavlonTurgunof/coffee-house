var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const form = document.getElementById("signin-form");
if (form) {
  form.addEventListener("submit", (e) =>
    __awaiter(void 0, void 0, void 0, function* () {
      e.preventDefault();
      const login = document.getElementById("login").value.trim();
      const password = document.getElementById("password").value.trim();
      if (!login || !password) {
        alert("Please enter both login and password!");
        return;
      }
      const data = { login, password };
      try {
        const response = yield fetch(
          "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const result = yield response.json();
        if (!response.ok) {
          alert(
            result.message || "Login failed. Please check your credentials."
          );
          return;
        }
        alert("Login successful!");
        // ✅ Save token and user info
        localStorage.setItem("token", result.data.access_token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        // ✅ Redirect to home (or wherever you want)
        window.location.href = "/cart.html";
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    })
  );
} else {
  console.error(
    'signin-form not found. Did you add id="signin-form" to your form?'
  );
}

//# sourceMappingURL=signIn.js.map
