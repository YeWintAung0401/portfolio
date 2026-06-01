function calculateExperience() {
  const start = new Date("2023-07-01");
  const today = new Date();

  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();

  if (today.getDate() < start.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let yearStr = "";
  if (years > 0) {
    yearStr = `${years} year${years !== 1 ? "s" : ""}`;
  }

  let monthStr = "";
  if (months > 0) {
    monthStr = `${months} month${months !== 1 ? "s" : ""}`;
  }

  const displayStr = [yearStr, monthStr].filter(Boolean).join(" ");

  document.getElementById("workingDays").innerText = displayStr || "0 months";
}

calculateExperience();

const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});
