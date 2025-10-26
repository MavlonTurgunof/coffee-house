interface RegistrationData {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: string;
}

const form = document.getElementById("registration-form") as HTMLFormElement;

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = (
      document.getElementById("login") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();
    const confirmPassword = (
      document.getElementById("confirm-password") as HTMLInputElement
    ).value.trim();
    const city = (
      document.getElementById("city") as HTMLInputElement
    ).value.trim();
    const street = (
      document.getElementById("street") as HTMLInputElement
    ).value.trim();
    const houseNumberValue = (
      document.getElementById("house-number") as HTMLInputElement
    ).value.trim();
    const paymentMethod = (
      document.querySelector('input[name="pay"]:checked') as HTMLInputElement
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

    const data: RegistrationData = {
      login,
      password,
      confirmPassword, // ✅ required by backend
      city,
      street,
      houseNumber,
      paymentMethod,
    };

    try {
      const response = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

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
      alert(`Error: ${(error as Error).message}`);
    }
  });
} else {
  console.error(
    "Form not found. Check that #registration-form exists in HTML."
  );
}
