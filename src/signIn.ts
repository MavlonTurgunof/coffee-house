interface LoginResponse {
  data: {
    access_token: string;
    user: {
      id: number;
      login: string;
      city: string;
      street: string;
      houseNumber: number;
      paymentMethod: string;
      createdAt: string;
    };
  };
  message: string;
}

const form = document.getElementById("signin-form") as HTMLFormElement;

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = (
      document.getElementById("login") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();

    if (!login || !password) {
      alert("Please enter both login and password!");
      return;
    }

    const data = { login, password };

    try {
      const response = await fetch(
        "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result: LoginResponse = await response.json();

      if (!response.ok) {
        alert(result.message || "Login failed. Please check your credentials.");
        return;
      }

      alert("Login successful!");

      // ✅ Save token and user info
      localStorage.setItem("token", result.data.access_token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      // ✅ Redirect to home (or wherever you want)
      window.location.href = "./cart.html";
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  });
} else {
  console.error(
    'signin-form not found. Did you add id="signin-form" to your form?'
  );
}
