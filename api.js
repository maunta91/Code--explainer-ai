const analyzeBtn = document.getElementById("analyzeBtn");

const codeInput = document.getElementById("codeInput");

const loading = document.getElementById("loading");

const errorBox = document.getElementById("errorBox");

const explanationOutput = document.getElementById("explanationOutput");

const issuesOutput = document.getElementById("issuesOutput");

const suggestionOutput = document.getElementById("suggestionOutput");

analyzeBtn.addEventListener("click", () => {

    const code = codeInput.value.trim();

    // Hide previous error
    errorBox.classList.add("hidden");

    // Validation
    if (code === "") {

        errorBox.classList.remove("hidden");

        return;
    }

    // Show loading
    loading.classList.remove("hidden");

    // Fake AI delay
    setTimeout(() => {

        loading.classList.add("hidden");

        // Explanation
        explanationOutput.innerText =
            "This code processes user input and performs logical operations.";

        // Issues
        issuesOutput.innerHTML = `
            <li>Missing proper error handling</li>
            <li>Code readability can be improved</li>
            <li>Variable naming is unclear</li>
        `;

        // Suggested Fix
        suggestionOutput.innerText =
`try {

    // improved code here

} catch(error) {

    console.log(error);

}`;

    }, 2000);

});
async function analyzeCode(code) {
  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code })
  });

  const data = await response.json();
  return data; // has data.explanation, data.issues, data.suggestion
}
document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const code = document.getElementById("codeInput").value;
  const result = await analyzeCode(code);

  document.getElementById("explanation").innerText = result.explanation;
  document.getElementById("issues").innerText = result.issues.join("\n");
  document.getElementById("suggestion").innerText = result.suggestion;
});
