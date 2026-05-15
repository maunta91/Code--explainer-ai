const GROQ_API_KEY = "YOUR_GROQ_KEY_HERE";
async function analyzeCode(userCode) {

  // Validation
  if (!userCode || userCode.trim() === "") {
    return { error: true, message: "Please paste some code first." };
  }

  if (userCode.length > 8000) {
    return { error: true, message: "Code too long. Keep under 8000 characters." };
  }

  const prompt = `
Analyze the following code and respond ONLY in this exact JSON format:
{
  "explanation": "What this code does in 3-5 plain English sentences.",
  "issues": ["issue 1", "issue 2", "issue 3"],
  "suggestion": "Improved version with one sentence explaining what changed."
}
No markdown. No backticks. Valid JSON only.
If no issues found write: ["No major issues found"]

Code:
${userCode}
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (data.error) {
      return { error: true, message: data.error.message };
    }

    const raw = data.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);

  } catch (err) {
    return { error: true, message: "Something went wrong. Try again." };
  }
}