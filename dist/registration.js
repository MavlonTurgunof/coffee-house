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
const form = document.getElementById("registration-form");
if (form) {
  form.addEventListener("submit", (e) =>
    __awaiter(void 0, void 0, void 0, function* () {
      e.preventDefault();
      const login = document.getElementById("login").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirm-password")
        .value.trim();
      const city = document.getElementById("city").value.trim();
      const street = document.getElementById("street").value.trim();
      const houseNumberValue = document
        .getElementById("house-number")
        .value.trim();
      const paymentMethod = document.querySelector(
        'input[name="pay"]:checked'
      ).value;
      // ✅ Validation
      if (!login || !password || !confirmPassword) {
        alert("Login and passwords are required!");
        return;
      }
      const loginRegex = /^[A-Za-z][A-Za-z0-9]*$/;
      if (!loginRegex.test(login)) {
        alert(
          "Login must start with a letter and contain only English letters and numbers"
        );
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const houseNumber = parseInt(houseNumberValue, 10);
      if (isNaN(houseNumber)) {
        alert("House number must be a valid number");
        return;
      }
      const data = {
        login,
        password,
        confirmPassword, // ✅ required by backend
        city,
        street,
        houseNumber,
        paymentMethod,
      };
      try {
        const response = yield fetch(
          "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const result = yield response.json();
        if (!response.ok) {
          // ✅ Handle backend errors gracefully
          if (result.message && Array.isArray(result.message)) {
            alert(result.message.join("\n"));
          } else if (result.message) {
            alert(result.message);
          } else {
            alert("Registration failed, please check your inputs.");
          }
          return;
        }
        alert("Registration successful!");
        window.location.href = "/signIn.html"; // ✅ redirect on success
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    })
  );
} else {
  console.error(
    "Form not found. Check that #registration-form exists in HTML."
  );
}

//# sourceMappingURL=registration.js.map
