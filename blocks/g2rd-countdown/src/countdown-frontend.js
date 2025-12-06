document.addEventListener("DOMContentLoaded", function () {
  const countdowns = document.querySelectorAll(".g2rd-countdown");

  countdowns.forEach((countdown) => {
    // Vérifier que la date de fin est valide
    const endDateValue = countdown.dataset.endDate;
    if (!endDateValue) {
      // Si pas de date définie, afficher "00" pour toutes les valeurs
      const items = countdown.querySelectorAll(".countdown-item");
      items.forEach((item) => {
        const valueElement = item.querySelector(".countdown-value");
        if (valueElement) {
          valueElement.textContent = "00";
        }
      });
      return;
    }

    const endDate = new Date(endDateValue).getTime();

    // Vérifier que la date est valide (pas NaN)
    if (isNaN(endDate)) {
      // Si la date est invalide, afficher "00" pour toutes les valeurs
      const items = countdown.querySelectorAll(".countdown-item");
      items.forEach((item) => {
        const valueElement = item.querySelector(".countdown-value");
        if (valueElement) {
          valueElement.textContent = "00";
        }
      });
      return;
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endDate - now;

      // Si le temps est écoulé, afficher "00" pour toutes les valeurs
      if (distance < 0) {
        const items = countdown.querySelectorAll(".countdown-item");
        items.forEach((item) => {
          const valueElement = item.querySelector(".countdown-value");
          if (valueElement) {
            valueElement.textContent = "00";
          }
        });
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

        if (!valueElement) return;

        // S'assurer que les valeurs ne sont pas NaN
        let value = 0;
        switch (label) {
          case "years":
            value = isNaN(years) ? 0 : years;
            valueElement.textContent = value.toString().padStart(2, "0");
            break;
          case "months":
            value = isNaN(months) ? 0 : months;
            valueElement.textContent = value.toString().padStart(2, "0");
            break;
          case "days":
            value = isNaN(days) ? 0 : days;
            valueElement.textContent = value.toString().padStart(2, "0");
            break;
          case "hours":
            value = isNaN(hours) ? 0 : hours;
            valueElement.textContent = value.toString().padStart(2, "0");
            break;
          case "minutes":
            value = isNaN(minutes) ? 0 : minutes;
            valueElement.textContent = value.toString().padStart(2, "0");
            break;
          case "seconds":
            value = isNaN(seconds) ? 0 : seconds;
            valueElement.textContent = value.toString().padStart(2, "0");
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
