const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const analyzeAnotherBtn = document.getElementById("analyzeAnotherBtn");
const askQuestionBtn = document.getElementById("askQuestionBtn");
const codeInput = document.getElementById("codeInput");
const questionInput = document.getElementById("questionInput");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");
const explanationOutput = document.getElementById("explanationOutput");
const issuesOutput = document.getElementById("issuesOutput");
const suggestionOutput = document.getElementById("suggestionOutput");
const actionButtons = document.getElementById("actionButtons");
const askQuestionSection = document.getElementById("askQuestionSection");
const answerOutput = document.getElementById("answerOutput");

async function analyzeCode(code) {
  const response = await fetch("https://code-explainer-ai-pnlt.onrender.com/analyze",  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code })
  });
  const data = await response.json();
  return data;
}

async function askQuestion(question, context) {
  const response = await fetch("https://code-explainer-ai-pnlt.onrender.com/ask-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: question, context: context })
  });
  const data = await response.json();
  return data;
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "copy-success";
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slideInRight 0.3s ease-out reverse";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function resetResults() {
  explanationOutput.innerText = "AI explanation will appear here.";
  issuesOutput.innerHTML = "<li>No issues detected yet.</li>";
  suggestionOutput.innerText = "Your improved code will appear here.";
  copyBtn.classList.add("hidden");
  actionButtons.classList.add("hidden");
  askQuestionSection.classList.add("hidden");
  answerOutput.classList.add("hidden");
  questionInput.value = "";
}

analyzeBtn.addEventListener("click", async () => {
  const code = codeInput.value.trim();

  // Validation
  if (code === "") {
    errorBox.classList.remove("hidden");
    setTimeout(() => errorBox.classList.add("hidden"), 3000);
    return;
  }

  // Reset
  errorBox.classList.add("hidden");
  resetResults();

  // Show loading
  loading.classList.remove("hidden");

  try {
    const result = await analyzeCode(code);

    // Hide loading
    loading.classList.add("hidden");

    // Populate panels
    explanationOutput.innerText = result.explanation;

    issuesOutput.innerHTML = "";
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach(issue => {
        const li = document.createElement("li");
        li.innerText = issue;
        issuesOutput.appendChild(li);
      });
    } else {
      issuesOutput.innerHTML = "<li>✅ No issues found! Your code looks good.</li>";
    }

    suggestionOutput.innerText = result.suggestion;

    // Show copy button, action buttons, and question section
    copyBtn.classList.remove("hidden");
    actionButtons.classList.remove("hidden");
    askQuestionSection.classList.remove("hidden");

  } catch (err) {
    loading.classList.add("hidden");
    explanationOutput.innerText = "❌ Could not connect to server. Make sure backend is running.";
    console.error("Error:", err);
  }
});

// Ask question functionality
askQuestionBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  const context = explanationOutput.innerText;

  if (question === "") {
    showNotification("⚠️ Please enter a question");
    return;
  }

  // Show loading state
  askQuestionBtn.disabled = true;
  askQuestionBtn.innerHTML = "⏳ Thinking...";
  answerOutput.classList.add("hidden");

  try {
    const result = await askQuestion(question, context);
    
    // Show answer
    answerOutput.innerText = result.answer;
    answerOutput.classList.remove("hidden");
    
    // Reset button
    askQuestionBtn.disabled = false;
    askQuestionBtn.innerHTML = "💬 Ask";
    
    showNotification("✅ Answer received!");
    
  } catch (err) {
    askQuestionBtn.disabled = false;
    askQuestionBtn.innerHTML = "💬 Ask";
    showNotification("❌ Failed to get answer");
    console.error("Error:", err);
  }
});

// Allow Enter key to submit question
questionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    askQuestionBtn.click();
  }
});

// Clear button functionality
clearBtn.addEventListener("click", () => {
  codeInput.value = "";
  resetResults();
  errorBox.classList.add("hidden");
  showNotification("✨ Input cleared!");
});

// Copy button functionality
copyBtn.addEventListener("click", async () => {
  const codeText = suggestionOutput.innerText;
  
  try {
    await navigator.clipboard.writeText(codeText);
    showNotification("✅ Code copied to clipboard!");
    copyBtn.innerHTML = "✓ Copied!";
    
    setTimeout(() => {
      copyBtn.innerHTML = "📋 Copy";
    }, 2000);
  } catch (err) {
    showNotification("❌ Failed to copy code");
    console.error("Copy failed:", err);
  }
});

// Analyze another button functionality
analyzeAnotherBtn.addEventListener("click", () => {
  codeInput.value = "";
  codeInput.focus();
  resetResults();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showNotification("🔄 Ready for new code!");
});