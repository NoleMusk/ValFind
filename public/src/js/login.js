document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Login gagal.");
    }

    alert(`Selamat datang, ${payload.user.email}`);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

document
  .getElementById("google-login")
  .addEventListener("click", function () {
    alert("Login dengan Google belum diimplementasikan.");
  });
