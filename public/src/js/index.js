document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input input");
  const searchButton = document.getElementById("search-button");
  const randomButton = document.getElementById("random-button");
  const resultsContainer = document.querySelector(".results");
  const statusContainer = document.querySelector(".search-status");

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderResults(payload) {
    if (!payload.results.length) {
      resultsContainer.innerHTML = `
        <article class="result-card empty-state">
          <h2>Tidak ada hasil</h2>
          <p>Coba kata kunci lain seperti "museum", "park", atau "coffee".</p>
        </article>
      `;
      return;
    }

    resultsContainer.innerHTML = payload.results
      .map(
        (item) => `
          <article class="result-card">
            <div class="result-meta">
              <span>${escapeHtml(item.category)}</span>
              <span>${escapeHtml(item.neighborhood)}</span>
            </div>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.shortDescription)}</p>
            <div class="result-footer">
              <span>${escapeHtml(item.address)}</span>
              <a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">Detail</a>
            </div>
          </article>
        `,
      )
      .join("");
  }

  async function runSearch(query) {
    const finalQuery = query.trim();
    statusContainer.textContent = "Memuat hasil pencarian...";
    resultsContainer.innerHTML = "";

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(finalQuery)}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Gagal memuat data.");
      }

      const label = finalQuery ? `"${finalQuery}"` : "semua topik Seattle";
      statusContainer.textContent = `${payload.total} hasil ditemukan untuk ${label}.`;
      renderResults(payload);

      const nextUrl = finalQuery ? `?q=${encodeURIComponent(finalQuery)}` : window.location.pathname;
      window.history.replaceState({}, "", nextUrl);
    } catch (error) {
      statusContainer.textContent = error.message;
      resultsContainer.innerHTML = `
        <article class="result-card empty-state">
          <h2>Koneksi backend bermasalah</h2>
          <p>${escapeHtml(error.message)}</p>
        </article>
      `;
    }
  }

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      runSearch(searchInput.value);
    }
  });

  searchButton.addEventListener("click", function () {
    runSearch(searchInput.value);
  });

  randomButton.addEventListener("click", async function () {
    searchInput.value = "";
    await runSearch("");

    const cards = resultsContainer.querySelectorAll(".result-card");
    if (!cards.length) {
      return;
    }

    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.scrollIntoView({ behavior: "smooth", block: "center" });
    randomCard.classList.add("highlighted");
    setTimeout(() => randomCard.classList.remove("highlighted"), 1600);
  });

  // Script untuk membuka kamera saat tombol kamera diklik
  const cameraButton = document.querySelector(".photo");

  cameraButton.addEventListener("click", function () {
    // Cek apakah browser mendukung getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Minta akses kamera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          // Buat elemen video untuk menampilkan kamera
          const video = document.createElement("video");
          video.srcObject = stream;
          video.autoplay = true;
          video.style.width = "100%";
          video.style.maxWidth = "400px";
          video.style.borderRadius = "10px";
          video.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

          // Buat container untuk video
          const cameraContainer = document.createElement("div");
          cameraContainer.style.position = "fixed";
          cameraContainer.style.top = "50%";
          cameraContainer.style.left = "50%";
          cameraContainer.style.transform = "translate(-50%, -50%)";
          cameraContainer.style.zIndex = "1000";
          cameraContainer.style.background = "white";
          cameraContainer.style.padding = "20px";
          cameraContainer.style.borderRadius = "10px";
          cameraContainer.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";

          // Buat tombol close
          const closeButton = document.createElement("button");
          closeButton.textContent = "Tutup Kamera";
          closeButton.style.display = "block";
          closeButton.style.margin = "10px auto";
          closeButton.style.padding = "8px 16px";
          closeButton.style.border = "none";
          closeButton.style.borderRadius = "5px";
          closeButton.style.background = "#4285f4";
          closeButton.style.color = "white";
          closeButton.style.cursor = "pointer";

          closeButton.addEventListener("click", function () {
            // Stop kamera dan hapus elemen
            stream.getTracks().forEach((track) => track.stop());
            document.body.removeChild(cameraContainer);
          });

          // Tambahkan video dan tombol ke container
          cameraContainer.appendChild(video);
          cameraContainer.appendChild(closeButton);

          // Tambahkan ke body
          document.body.appendChild(cameraContainer);
        })
        .catch(function (error) {
          console.error("Error accessing camera:", error);
          alert(
            "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.",
          );
        });
    } else {
      alert("Browser Anda tidak mendukung akses kamera.");
    }
  });

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "Seattle";
  searchInput.value = initialQuery;
  runSearch(initialQuery);
});
