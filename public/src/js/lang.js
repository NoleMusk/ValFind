// simple i18n handling
const translations = {
  en: {
    vmail: "Vmail",
    gambar: "Images",
    searchPlaceholder: "Search Seattle places, neighborhoods, coffee, parks...",
    button1: "Search Seattle",
    button2: "Explore random",
    availableIn: "Available in:",
    english: "English",
    indonesia: "Indonesian",
    masuk: "Login",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    belum: "Don't have an account?",
    daftar: "Register",
    masukdengan: "Login with Google",
    daftarJudul: "Register",
    konfirmasi: "Confirm Password",
    sudah: "Already have an account?",
    beranda: "Home",
  },
  id: {
    vmail: "Vmail",
    gambar: "Gambar",
    searchPlaceholder: "Cari tempat, kawasan, kopi, taman di Seattle...",
    button1: "Cari Seattle",
    button2: "Jelajahi acak",
    availableIn: "Tersedia dalam bahasa:",
    english: "English",
    indonesia: "Indonesia",
    masuk: "Masuk",
    email: "Email",
    password: "Kata Sandi",
    forgot: "Lupa kata sandi?",
    belum: "Belum punya akun?",
    daftar: "Daftar",
    masukdengan: "Masuk dengan Google",
    daftarJudul: "Daftar",
    konfirmasi: "Konfirmasi Kata Sandi",
    sudah: "Sudah punya akun?",
    beranda: "Beranda",
  },
};

function applyLanguage(lang) {
  const elems = document.querySelectorAll("[data-i18n]");
  elems.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      if (el.placeholder !== undefined) {
        el.placeholder = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
  });
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
}

document.addEventListener("DOMContentLoaded", () => {
  let lang = localStorage.getItem("lang") || "en";
  applyLanguage(lang);

  document.querySelectorAll("[data-lang]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const chosen = link.getAttribute("data-lang");
      setLanguage(chosen);
    });
  });
});
