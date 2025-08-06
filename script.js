document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector("#search-btn");
  const usernameInput = document.querySelector("#user-input");
  const easyLabel = document.querySelector("#easy-label");
  const mediumLabel = document.querySelector("#medium-label");
  const hardLabel = document.querySelector("#hard-label");
  const easyProgress = document.querySelector("#easy-progress");
  const mediumProgress = document.querySelector("#medium-progress");
  const hardProgress = document.querySelector("#hard-progress");
  const cardStatsContainer = document.querySelector(".stats-card");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    if (!regex.test(username)) {
      alert("Invalid Username! Use letters, numbers, underscores, and dashes (1-15 chars).");
      return false;
    }

    return true;
  }

  function updateProgress(solved, total, label, circle, color) {
    const degree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${degree}%`);
    circle.style.background = `conic-gradient(${color} ${degree}%, #1f2937 0%)`;
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(data) {
    const {
      totalEasy,
      totalMedium,
      totalHard,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSubmissions,
    } = data;

    updateProgress(easySolved, totalEasy, easyLabel, easyProgress, "#34d399");   // green
    updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgress, "#facc15"); // yellow
    updateProgress(hardSolved, totalHard, hardLabel, hardProgress, "#f87171");   // red

    const cards = [
      { label: "Overall Submissions", value: totalSubmissions[0].submissions },
      { label: "Easy Submissions", value: totalSubmissions[1].submissions },
      { label: "Medium Submissions", value: totalSubmissions[2].submissions },
      { label: "Hard Submissions", value: totalSubmissions[3].submissions },
    ];

    cardStatsContainer.innerHTML = cards
      .map(
        (item) => `
      <div class="bg-white bg-opacity-10 backdrop-blur-md p-5 rounded-lg w-[45%] max-w-xs transition hover:scale-105 shadow-lg hover:shadow-xl">
        <h4 class="text-sm font-semibold text-indigo-200">${item.label}</h4>
        <p class="text-xl font-bold mt-1">${item.value}</p>
      </div>
    `
      )
      .join("");
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
      if (!res.ok) throw new Error("Unable to fetch user details");

      const data = await res.json();
      displayUserData(data);
    } catch (err) {
      alert("User not found or API error");
      console.error(err);
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  searchButton.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
