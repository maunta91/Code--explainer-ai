const analyzeBtn = document.getElementById("analyzeBtn");
const codeInput = document.getElementById("codeInput");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");
const explanationOutput = document.getElementById("explanationOutput");
const issuesOutput = document.getElementById("issuesOutput");
const suggestionOutput = document.getElementById("suggestionOutput");

async function analyzeCode(code) {
  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code })
  });
  const data = await response.json();
  return data;
}

analyzeBtn.addEventListener("click", async () => {
  const code = codeInput.value.trim();

  // Validation
  if (code === "") {
    errorBox.classList.remove("hidden");
    return;
  }

  // Reset
  errorBox.classList.add("hidden");
  explanationOutput.innerText = "";
  issuesOutput.innerHTML = "";
  suggestionOutput.innerText = "";

  // Show loading
  loading.classList.remove("hidden");

  try {
    const result = await analyzeCode(code);

    // Hide loading
    loading.classList.add("hidden");

    // Populate panels
    explanationOutput.innerText = result.explanation;

    issuesOutput.innerHTML = "";
    result.issues.forEach(issue => {
      const li = document.createElement("li");
      li.innerText = issue;
      issuesOutput.appendChild(li);
    });

    suggestionOutput.innerText = result.suggestion;

  } catch (err) {
    loading.classList.add("hidden");
    explanationOutput.innerText = "Could not connect to server. Make sure backend is running.";
  }
});