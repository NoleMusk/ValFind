document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Registrasi gagal.");
      }

      alert(`Akun ${payload.user.email} berhasil dibuat.`);
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
  });
