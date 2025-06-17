document.addEventListener("DOMContentLoaded", function () {
  const countdowns = document.querySelectorAll(".g2rd-countdown");

  countdowns.forEach((countdown) => {
    const endDate = new Date(countdown.dataset.endDate).getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        countdown.innerHTML =
          '<div class="countdown-ended">Countdown Ended!</div>';
        return;
      }

      // Calculs pour les différentes unités de temps
      const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (distance % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
      );
      const days = Math.floor(
        (distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Mise à jour des valeurs
      const items = countdown.querySelectorAll(".countdown-item");
      items.forEach((item) => {
        const label = item
          .querySelector(".countdown-label")
          .textContent.toLowerCase();
        const valueElement = item.querySelector(".countdown-value");

        switch (label) {
          case "years":
            valueElement.textContent = years.toString().padStart(2, "0");
            break;
          case "months":
            valueElement.textContent = months.toString().padStart(2, "0");
            break;
          case "days":
            valueElement.textContent = days.toString().padStart(2, "0");
            break;
          case "hours":
            valueElement.textContent = hours.toString().padStart(2, "0");
            break;
          case "minutes":
            valueElement.textContent = minutes.toString().padStart(2, "0");
            break;
          case "seconds":
            valueElement.textContent = seconds.toString().padStart(2, "0");
            break;
        }
      });
    }

    // Mise à jour initiale
    updateCountdown();

    // Mise à jour toutes les secondes
    setInterval(updateCountdown, 1000);
  });
});
