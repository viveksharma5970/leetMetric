document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector("#search-btn");
  const usernameInput = document.querySelector("#user-input");
  const statsContainer = document.querySelector(".stat-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.querySelector("#easy-label");
  const mediumLabel = document.querySelector("#medium-label");
  const hardLabel = document.querySelector("#hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");
  console.log(usernameInput);
  //return true or false based on a regex
  function validateUsername(username) {
    // Trim the input to remove spaces
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    // Regular expression to allow letters, numbers, underscores, and dashes (1 to 15 characters)
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;

    // Using .test() to check if the username matches the regex
    const isMatching = regex.test(username);

    if (!isMatching) {
      alert(
        "Invalid Username! Username can contain letters, numbers, underscores, and dashes (1-15 chars)."
      );
    }

    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      const response = await fetch(
        `https://leetcode-api-faisalshohag.vercel.app/${username}`
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Unable to fetch user details");
      }

      const result = await response.json();
      console.log("API result:", result);

      // Check if the expected data is there
      if (!result) {
        statsContainer.innerHTML = `<p>No data found for <strong>${username}</strong>.</p>`;
        return;
      }
      
      displayUserData(result);
    } catch (error) {
      statsContainer.innerHTML = `<p>No data found</p>`;
      console.error("Error fetching data:", error);
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved/total)*100;
    circle.style.setProperty("--progress-degree",`${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(data) {
    const totalQue = data.totalQuestions;
    const totalHardQues = data.totalHard;
    const totalMediumQues = data.totalMedium;
    const totalEasyQues = data.totalEasy;

    const solvedTotalQue = data.totalSolved;
    const solvedHardQue = data.hardSolved;
    const solvedMediumQue = data.mediumSolved;
    const solvedEasyQue = data.easySolved;

    updateProgress(solvedEasyQue, totalEasyQues, easyLabel,easyProgressCircle);
    updateProgress(solvedMediumQue, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedHardQue, totalHardQues, hardLabel, hardProgressCircle);

    const cardData = [
      {label: "Overall Submissions", value:data.totalSubmissions[0].submissions},
      {label: "Overall Easy Submissions", value:data.totalSubmissions[1].submissions},
      {label: "Overall Medium Submissions", value:data.totalSubmissions[2].submissions},
      {label: "Overall Hard Submissions", value:data.totalSubmissions[3].submissions}
    ];
    console.log(cardData);

    cardStatsContainer.innerHTML = cardData.map(
      mydata => {
        return `
          <div class="card">
          <h4>${mydata.label}</h4>
          <p>${mydata.value}</p>
          </div>
        `
      }
    ).join("");

  }
  
  searchButton.addEventListener("click", () => {
    const username = usernameInput.value;
    if (validateUsername(username)) {
      fetchUserDetails(username);
      // console.log(username);
    }
  });
});
