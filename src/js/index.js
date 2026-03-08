/*? no js js needed from me */

// Script untuk redirect ke Google saat Enter di input pencarian
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input input");

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      if (query !== "") {
        // Redirect ke Google search
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    }
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
});
